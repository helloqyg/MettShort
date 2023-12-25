<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:17:14
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-01 13:46:00
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :left="0" title="我的"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="userinfo_box" v-if="userInfoStore" @click="jumpView('/pages/user/info/index')">
				<view class="avatar">
					<image class="image" :src="userInfoStore.avatar" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">{{ userInfoStore.nickname }}</text>
						<image class="image" v-if="userInfoStore.is_vip == 1" src="/static/icons/vip.png" mode="widthFix" @click="openVip"></image>
					</view>
					<view class="msg">
						<text class="text">用户ID：{{ userInfoStore.user_id }}</text>
						<text class="copy" @click.stop="copyText(userInfoStore.user_id)">复制</text>
					</view>
				</view>
				<image class="arrow" src="/static/icons/arrow.png" mode="widthFix"></image>
			</view>
			<view class="userinfo_box" v-else @click="jumpView('/pages/login/login')">
				<view class="avatar">
					<image class="image" src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">未登录</text>
					</view>
					<view class="msg"></view>
				</view>
			</view>
			<view class="vip_card">
				<view class="vip_box" v-if="iosIsPay">
					<view class="left">
						<view class="line1">开通会员尊享多项特权</view>
						<view class="line2">开通VIP会员 专享剧集立即免费</view>
					</view>
					<view class="right">
						<u-button text="我的会员" v-if="userInfoStore.is_vip == 1" :customStyle="buttonStyle" @click="openVip" />
						<u-button text="立即开通" v-else :customStyle="buttonStyle" @click="openVip" />
					</view>
				</view>
				<view class="vip_box" v-else>
					<view class="left">
						<view class="line1">开通会员尊享多项特权</view>
						<view class="line2">开通VIP会员 专享剧集立即免费</view>
					</view>
					<view class="right">
						<u-button text="联系我们" :customStyle="buttonStyle" @click="openVip" />
					</view>
				</view>
				<view class="integral_box" @click="jumpView('/pages/user/integral/index')">
					<view class="right">
						<text class="text">我的积分</text>
						<image class="image" src="/static/icons/integral.png" mode="widthFix"></image>
						<text class="text">{{ userInfoStore.usable || 0 }}</text>
					</view>
					<view class="left">去充值 ></view>
				</view>
			</view>
			
			<view class="card_box">
				<view class="item" v-for="(item, index) in cardList" :key="item.id" @click="cardItemClick(item)">
					<view class="icon">
						<image class="image" :src="item.img" mode="aspectFill"></image>
					</view>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
			<view class="menu_box">
				<view class="item" v-for="(item, index) in menuList" :key="item.id" @click="menuItemClick(item.rid, item.text, item.path)">
					<view class="left">
						<view class="icon">
							<image class="image" :src="item.img" :style="{ width: item.width }" mode="widthFix"></image>
						</view>
						<view class="text">{{ item.text }}</view>
					</view>
					<view class="right">
						<u-icon name="arrow-right" color="#fff" size="12" :bold="true"></u-icon>
						<!-- <image class="image" src="/static/icons/arrow.png" mode="widthFix"></image> -->
					</view>
				</view>
			</view>
			<view class="copyright" v-if="copyrightData.length" @click="debugClick">
				<view class="item" v-for="(item, index) in copyrightData" :key="index">
					<image class="image" v-if="item.image" :src="item.image" mode="widthFix"></image>
					<!-- #ifdef MP-WEIXIN -->
					<text class="text">{{ item.name }}</text>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<a v-if="item.url" :href="item.url" target="_blank" rel="">
						<text class="text">{{ item.name }}</text>
					</a>
					<text v-else class="text">{{ item.name }}</text>
					<!-- #endif -->
				</view>
			</view>
			<view class="alert_box" v-if="platform != 'H5' && token && userInfoStore && configStore.system.mobile_switch == 1">
				<view class="item" v-if="!userInfoStore.verification.mobile">
					<text class="text">您还没有绑定手机号</text>
					<text class="btn" @click="alertBindButton('mobile')">去绑定</text>
				</view>
			</view>
			<u-modal :show="cdkey.show" :title="cdkey.title" :showCancelButton="true" @confirm="cdkeyConfirm" @cancel="cdkey.show = false">
				<view style="width: 100%;">
					<u-input v-model="cdkey.value" :customStyle="inputStyle" clearable placeholder="请输入兑换码" @change="inputChange" @blur="inputChange"></u-input>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				buttonStyle: {
					width: '100%',
					height: '100%',
					border: 'none',
					fontSize: '24rpx',
					color: '#DF9B45',
					background: '#fff',
					borderRadius: '8rpx',
					fontWeight: 'bold'
				},
				cardList: [
					{ id: 1, img: '/static/icons/menu_2.png', text: '观看记录', path: '/pages/video/record' },
					{ id: 2, img: '/static/icons/menu_3.png', text: '申请分销商', path: '/pages/user/dealer/index' },
					{ id: 3, img: '/static/icons/menu_4.png', text: '分享赚钱', path: '/pages/user/share/index' },
					{ id: 4, img: '/static/icons/menu_1.png', text: '卡密兑换', path: '' },
				],
				menuList: [
					// #ifndef APP-PLUS
					{ id: 1, img: '/static/icons/list_2.png', width: '32rpx', text: '邀请好友', rid: '', path: '/pages/user/share/poster' },
					// #endif
					{ id: 7, img: '/static/icons/list_2.png', width: '28rpx', text: '获取积分', rid: '', path: '/pages/user/integral/task' },
					{ id: 2, img: '/static/icons/list_4.png', width: '28rpx', text: '用户协议', rid: '' },
					{ id: 3, img: '/static/icons/list_2.png', width: '28rpx', text: '隐私协议', rid: '' },
					{ id: 4, img: '/static/icons/list_3.png', width: '28rpx', text: '法律声明', rid: '' },
					{ id: 5, img: '/static/icons/list_5.png', width: '32rpx', text: '联系我们', rid: '' },
					{ id: 6, img: '/static/icons/list_3.png', width: '28rpx', text: '关于我们', rid: '' },
				],
				copyrightData: this.$store.state.app.copyright || [], // 版权说明
				platform: this.$utils.platforms(),
				configStore: this.$store.state.app.config,
				userInfoStore: this.$store.state.user.userInfo,
				debug: {
					count: 0,
					timer: null
				},
				cdkey: {
					show: false,
					title: '卡密兑换',
					value: '',
				},
				inputStyle: {}
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config", "copyright", "richtext", "iosIsPay"]),
		},
		watch: {
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue
				}
			},
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.userInfoStore = newValue
				}
			},
			copyright(newValue, oldValue) {
				this.copyrightData = newValue
			},
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue)
			}
		},
		onPullDownRefresh() {
			if(this.token) {
				this.getUserInfo().then(res => {
					uni.stopPullDownRefresh()
				}).catch(err => {
					uni.stopPullDownRefresh()
				})
			} else {
				uni.stopPullDownRefresh()
			}
		},
		onLoad() {
			uni.$on('updateUserInfo', () => {
				this.getUserInfo()
			})

			this.richtext && this.initMenuList(this.richtext)
		},
		onShow() {
			this.token && this.getUserInfo()
		},
		onUnload() {
			uni.$off('updateUserInfo')
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			// 调试
			debugClick() {
				// #ifdef MP-WEIXIN
				const env = wx.getAccountInfoSync().miniProgram.envVersion
				if(env != "release") {
					clearTimeout(this.debug.timer);
					this.debug.count++;
					this.debug.timer = setTimeout(() => {
						if (this.debug.count >= 5) {
							uni.showModal({
								title: '配置信息',
								content: `
									(env => ${env}) -
									(domain => ${this.$BASE_URL}) -
									(sign => ${this.$SIGN})
								`
							})
						}
						this.debug.count = 0;
					}, 500);
				}
				// #endif
			},
			alertBindButton(type) {
				if(type == 'wxmp') {
					console.log("绑定微信小程序");
				} else if(type == 'wxoa') {
					console.log("绑定微信公众号");
				} else if(type == 'mobile') {
					console.log("绑定手机号");
					this.jumpView('/pages/user/info/index')
				}
			},
			// 复制
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						this.$u.toast('复制成功')
					}
				});
			},
			// 富文本ID
			initMenuList(data) {
				this.menuList.map(item => {
					switch(item.id) {
						case 2:
							item.rid = data.user_protocol
							break;
						case 3:
							item.rid = data.privacy_protocol
							break;
						case 4:
							item.rid = data.legal_notice
							break;
						case 5:
							item.rid = data.contact_us
							break;
						case 6:
							item.rid = data.about_us
							break;
					}
				})
			},
			// 菜单列表点击
			menuItemClick(id, title, url) {
				if(url) {
					if(!this.token) return this.$u.toast('请先登录!')
					this.jumpView(url)
				} else {
					if(!id) return this.$u.toast('功能正在开发中')
					const obj = { id, title }
					this.jumpView(`/pages/user/info/richtext?d=${encodeURIComponent(JSON.stringify(obj))}`)
				}
			},
			// 会员中心
			openVip() {
				// #ifdef MP-WEIXIN
				if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
				// #endif

				if(!this.token) return this.$u.toast('请先登录!')
				this.jumpView('/pages/user/member/index')
			},
			// 输入框验证
			inputChange() {
				let result = false
				if(!this.cdkey.value) {
					this.inputStyle = {
						borderColor: 'red !important'
					}
				} else {
					this.inputStyle = {}
					result = true
				}
				return result
			},
			// 卡密兑换
			cdkeyConfirm() {
				if(!this.inputChange()) return
				uni.showLoading({
					title: '兑换中'
				})

				this.$request('user.cdkey', {
					crypto: this.cdkey.value,
					platform: this.$utils.platforms()
				}).then(res => {
					if(res.code === 1) {
						this.getUserInfo()
						this.$u.toast(res.msg)
					}
					this.cdkey.value = ''
					this.cdkey.show = false
					// uni.hideLoading()
				}).catch(err => {
					this.$u.toast('兑换失败')
					this.cdkey.value = ''
					this.cdkey.show = false
					uni.hideLoading()
				})
			},
			// 功能区点击
			cardItemClick(item) {
				if(!item.path) {
					if(item.id === 4) {
						if(!this.token) return this.$u.toast('请先登录!')
						this.cdkey.show = true
					} else {
						this.$u.toast('暂未开放')
					}
				} else {
					if(item.id === 2) {
						// #ifdef MP-WEIXIN
						if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
						// #endif
					}
					if(!this.token) return this.$u.toast('请先登录!')
					this.jumpView(item.path)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		position: relative;
		
		.head_content {}
		
		.main_content {
			padding: 24rpx 40rpx 152rpx 40rpx;
			overflow-y: auto;
			
			.userinfo_box {
				display: flex;
				align-items: center;
				position: relative;
				
				.arrow {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%) rotate(0deg);
					width: 44rpx;
				}
				
				.avatar {
					width: 130rpx;
					height: 130rpx;
					border-radius: 50%;
					border: 2rpx solid #fff;
					overflow: hidden;
					
					.image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				
				.info {
					flex: 1;
					margin-left: 32rpx;
					
					.nickname {
						display: flex;
						
						.text {
							font-size: 34rpx;
							color: #000;
							font-weight: 900;
						}
						
						.image {
							width: 52rpx;
							margin-left: 8rpx;
						}
					}
					
					.msg {
						margin-top: 20rpx;
						font-size: 24rpx;
						
						.text {
							color: #808080;
						}
						
						.copy {
							color: #5E5E5E;
							margin-left: 8rpx;
							text-decoration: underline;
							display: inline-block;
						}
					}
				}
			}
			
			.vip_card {
				border-radius: 16rpx;
				overflow: hidden;
				margin: 40rpx 0;
				
				.vip_box {
					width: 100%;
					height: 144rpx;
					padding: 0 32rpx;
					box-sizing: border-box;
					background: #DF9B45;
					background-image: url('~@/static/images/vip_bg.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.left {
						color: #fff;
						
						.line1 {
							font-size: 32rpx;
							font-weight: bold;
						}
						
						.line2 {
							font-size: 24rpx;
							margin-top: 16rpx;
						}
					}
					
					.right {
						width: 156rpx;
						height: 60rpx;
					}
				}
				
				.integral_box {
					height: 80rpx;
					background: #DE9E45;
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #fff;
					padding: 0 32rpx;
					font-size: 24rpx;
					font-weight: 700;
					
					.left {
						color: #fff;
					}
					
					.right {
						display: flex;
						align-items: center;
						
						.image {
							width: 30rpx;
							margin-right: 8rpx;
							margin-left: 12rpx;
						}
						
						.text {}
					}
				}
			}

			.card_box {
				display: flex;
				flex-wrap: wrap;
				// background: #fff;
				border-radius: 16rpx;
				padding: 20rpx 0;
				background: linear-gradient(141.96deg, #EE7F33 0%, #FFB98A 100%);
				
				.item {
					width: 25%;
					
					.icon {
						width: 84rpx;
						height: 84rpx;
						margin: 0 auto;
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
					
					.text {
						font-size: 24rpx;
						color: #999;
						color: #fff;
						text-align: center;
						margin-top: 8rpx;
					}
				}
			}
		
			.menu_box {
				background: #fff;
				border-radius: 16rpx;
				padding: 30rpx 40rpx;
				margin-top: 40rpx;
				background: linear-gradient(141.96deg, #EE7F33 0%, #FFB98A 100%);
				
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 28rpx 0;
					
					.left {
						display: flex;
						align-items: center;
						
						.icon {
							width: 36rpx;
							height: 36rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.image {
								width: 100%;
							}
						}
						
						.text {
							font-size: 28rpx;
							// color: #333;
							color: #fff;
							margin-left: 40rpx;
							font-weight: bold;
						}
					}
					
					.right {
						.image {
							width: 32rpx;
						}
					}
				}
			}
			
			.copyright {
				margin-top: 60rpx;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 36rpx;
					
					a {
						text-decoration: none;
					}
					
					.image {
						width: 30rpx;
						margin-right: 8rpx;
					}
					
					.text {
						font-size: 24rpx;
						color: rgba(#999, 0.5);
					}
				}
			}
			
			.alert_box {
				width: 100%;
				padding: 0 40rpx;
				position: absolute;
				bottom: 20rpx;
				left: 0;

				.item {
					padding: 20rpx;
					border-radius: 20rpx;
					background: rgba(0, 0, 0, 0.9);
					color: #fff;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.text {}
					
					.btn {
						background: #C78021;
						padding: 8rpx 20rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>
