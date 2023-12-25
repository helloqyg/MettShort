<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:20:44
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-21 13:51:52
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="VideoMenu" :class="{ active: show }" @click="$emit('close')">
		<view class="popup" @click.stop="">
			<view class="p_head">
				<view class="left">
					<text class="text1">{{ info.title }}</text>
					<text class="text2">共{{ info.length }}集</text>
				</view>
				<view class="right" @click="$emit('close')">关闭</view>
			</view>
			<view class="p_content">
				<view class="item" :class="{ active: currentIndex == index }" v-for="(item, index) in data" :key="index" @click="changeWatch(index)">
					<image class="cover" :src="item.image" mode="aspectFill"></image>
					<view class="info" v-if="item.url">{{ item.name }}</view>
					<view class="lock" v-else>
						<image class="icon" src="/static/icons/lock.png" mode="widthFix"></image>
						<text class="text">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "VideoMenu",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			info: {
				type: Object,
				default: {}
			},
			data: {
				type: Array,
				default: []
			},
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentIndex: this.current
			};
		},
		watch: {
			current(newValue, oldValue) {
				this.changeWatch(newValue, 1)
			}
		},
		created() {
			
		},
		methods: {
			changeWatch(index, x) {
				if(!this.data[index].url && index != this.data.findIndex(item => !item.url)) {
					if(x != 1) {
						this.$u.toast("请按剧集顺序点播！")
					} else {
						this.currentIndex = index
					}
				} else {
					this.currentIndex = index
					if(x != 1) {
						this.$emit('selected', index)
						this.$emit('close')
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.VideoMenu {
		width: 100%;
		height: 100%;
		position: absolute;
		bottom: -100%;
		left: 0;
		z-index: 100;
		transition: all 0.5s;
		
		&.active {
			bottom: 0;
		}
		
		.popup {
			width: 100%;
			height: 60%;
			background: #000;
			border-radius: 20rpx 20rpx 0 0;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			color: #fff;
			padding: 0 40rpx;
			border-top: 2rpx solid #333;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			
			.p_head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				position: relative;
				padding: 30rpx 0;
				font-size: 32rpx;

				.left {
					flex: 1;
					display: flex;
					flex-direction: row;
					
					.text1 {
						font-weight: 700;
						line-height: 48rpx;
					}
					
					.text2 {
						font-size: 24rpx;
						color: rgba(#fff, 0.5);
						margin: 0 40rpx;
						white-space: nowrap;
						line-height: 48rpx;
					}
				}
				
				.right {
					color: #EE7F33;
					white-space: nowrap;
					margin-left: 20rpx;
				}
			}
			
			.p_content {
				flex: 1;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				overflow-y: auto;
				padding: 20rpx 0;
				
				.item {
					width: calc((100% - 60rpx) / 3);
					height: 252rpx;
					margin-right: 30rpx;
					margin-bottom: 40rpx;
					position: relative;
					background: rgba(#fff, 0.1);
					font-size: 28rpx;
					border: 4rpx solid transparent;
					border-radius: 10rpx;
					overflow: hidden;
					
					&:nth-child(3n) {
						margin-right: 0;
					}
					
					&.active {
						border-color: #EE7F33;
					}
					
					.cover {
						width: 100%;
						height: 100%;
					}
					
					.info {
						width: 100%;
						padding: 8rpx;
						text-align: center;
						position: absolute;
						bottom: 0;
						left: 0;
						background: rgba(#000, 0.5);
					}
					
					.lock {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						background: rgba(#000, 0.7);
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						
						.icon {
							width: 60rpx;
							margin-bottom: 8rpx;
						}
					}
				}
			}
		}
	}
</style>