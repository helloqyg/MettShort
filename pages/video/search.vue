<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:21:50
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-19 15:00:09
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar lText="返回"></CustomNavbar>
			<view class="search_box">
				<u-search v-model="contents.keyword" :showAction="true" actionText="搜索" :animation="true" @custom="searchHandle" @search="searchHandle"></u-search>
			</view>
		</view>
		<view class="main_content">
			<scroll-view style="height: 100%" :scroll-y="true" :refresher-enabled="true" :refresher-threshold="100" :refresher-triggered="refreshStatus" @refresherrefresh="refreshHandle" @scrolltolower="bottomHandle">
				<view class="info_box" v-if="!isSearch">为您推荐</view>
				<view class="content_box">
					<view class="list" v-if="contents.list && contents.list.length">
						<view class="item item2" v-for="(lItem, lIndex) in contents.list" :key="lIndex" @click="openVideoDetail(lItem.id, lItem.title, lItem.image, lItem.description)">
							<view class="img">
								<image class="image" :src="lItem.image" mode="aspectFill"></image>
							</view>
							<view class="info">
								<view class="title u-line-1">{{ lItem.title }}</view>
								<view class="text u-line-1">{{ lItem.description }}</view>
							</view>
						</view>
					</view>
					<view class="nodata" v-if="!contents.list.length && contents.status == 'nomore'">
						<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" />
					</view>
					<view class="liststatus" v-if="contents.list.length && isSearch">
						<u-loadmore :status="contents.status" :line="true" />
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshStatus: true,
				isRefresh: false,
				contents: {
					list: [],
					page: 1,
					pagesize: 10,
					status: 'loadmore',
					keyword: ''
				},
				isSearch: false
			}
		},
		onLoad() {
			this.getRecommendList()
		},
		methods: {
			// 推荐视频
			getRecommendList() {
				const obj = {
					type: 'recommend',
					pagesize: 9
				}
				this.$request('video.list', obj).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.contents.list = res.data
						}
					}
					this.refreshStatus = false
					this.isRefresh = false
				}).catch(err => {
					this.refreshStatus = false
					this.isRefresh = false
				})
			},
			// 搜索事件
			searchHandle() {
				if(!this.contents.keyword) return
				this.isSearch = true
				this.contents.page = 1
				this.contents.list = []
				this.getVideoList()
			},
			// 获取视频列表
			getVideoList() {
				if(!this.contents.keyword) return
				const obj = {
					search: this.contents.keyword,
					page: this.contents.page,
					pagesize: this.contents.pagesize
				}
				this.contents.status = 'loading'
				this.$request('video.list', obj).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.contents.list = this.contents.list.concat(res.data)
							this.contents.status = 'loadmore'
							if(res.data.length < this.contents.pagesize) {
								this.contents.status = 'nomore'
							} else {
								this.contents.status = 'loadmore'
							}
						} else {
							this.contents.page > 1 && this.contents.page--
							const timer = setTimeout(() => {
								this.contents.status = 'nomore'
								clearTimeout(timer)
							}, 500)
						}
					}
					this.refreshStatus = false
					this.isRefresh = false
				}).catch(err => {
					this.refreshStatus = false
					this.isRefresh = false
				})
			},
			// 下拉刷新
			refreshHandle() {
				this.refreshStatus = true
				if(!this.isRefresh) {
					this.isRefresh = true
					if(!this.isSearch) {
						this.getRecommendList()
					} else {
						this.contents.page = 1
						this.contents.list = []
						this.getVideoList()
					}
				}
			},
			// 触底滚动
			bottomHandle() {
				if(!this.isSearch) return
				this.contents.page++
				this.getVideoList()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		overflow: hidden;
		
		.head_content {
			.search_box {
				padding: 20rpx 40rpx;
			}
		}
		
		.main_content {
			overflow: hidden;
			
			.info_box {
				padding: 20rpx 40rpx;
				font-size: 32rpx;
				font-weight: 700;
			}
			
			.content_box {
				padding: 20rpx 40rpx 60rpx 40rpx;
				
				.list {
					display: flex;
					flex-wrap: wrap;
					
					.item {
						width: calc((100% - 50rpx) / 3);
						margin-bottom: 40rpx;
						margin-right: 25rpx;
						
						&.item1 {
							&:nth-child(10n),
							&:nth-child(10n-3),
							&:nth-child(10n-6) {
								margin-right: 0;
							}
						}
						
						&.item2 {
							&:nth-child(3n) {
								margin-right: 0;
							}
						}
						
						.img {
							width: 100%;
							height: 280rpx;
							border-radius: 20rpx;
							overflow: hidden;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.info {
							margin-top: 16rpx;
							
							.title {
								font-size: 28rpx;
								color: #111;
								font-weight: 700;
							}
							
							.text {
								font-size: 24rpx;
								color: #666;
								margin-top: 4rpx;
							}
						}
					}
				}
				
				.nodata {
					padding: 15vh 0;
				}
			}
		}
	}
</style>