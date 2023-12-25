/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:14:37
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-08-19 16:46:50
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */


import request from 'common/request/index.js'
import utils from 'common/utils/index.js'

import store from '..'
import { BASE_URL, SIGN } from '@/env.js';
// #ifdef H5
const jweixin = require('jweixin-module')
import wxoaShare from '@/common/utils/share.js'
// #endif

export default {
	namespaced: true,
	state: {
		config: "",
		appid: "",
		title: "",
		copyright: [],
		richtext: "",
		options: "",
		share: "",
		jwx: false,
		iosIsPay: false,
		updateInfo: {},
		videoAutoplay: 0,
		playletShare: {
			id: "",
			title: "",
			image: "",
			desc: ""
		}
	},
	getters: {
		config: state => state.config,
		appid: state => state.appid,
		title: state => state.title,
		copyright: state => state.copyright,
		richtext: state => state.richtext,
		options: state => state.options,
		share: state => state.share,
		jwx: state => state.jwx,
		iosIsPay: state => state.iosIsPay,
		updateInfo: state => state.updateInfo,
		videoAutoplay: state => state.videoAutoplay
	},
	mutations: {
		setConfig(state, data) {
			state.config = data
		},
		setAppid(state, data) {
			state.appid = data
		},
		setTitle(state, data) {
			state.title = data
		},
		setCopyright(state, data) {
			state.copyright = data
		},
		setRichtext(state, data) {
			state.richtext = data
		},
		setOptions(state, data) {
			state.options = data
		},
		setShare(state, data) {
			state.share = data
		},
		setJwx(state, data) {
			state.jwx = data
		},
		setIosIsPay(state, data) {
			state.iosIsPay = data
		},
		setUpdateInfo(state, data) {
			state.updateInfo = data
		},
		setVideoAutoplay(state, data) {
			state.videoAutoplay = data
		}
	},
	actions: {
		// 获取配置信息
		async getConfigInfo({ commit, dispatch, getters, state }, options) {
			const result = await request("common.init", {
				platform: utils.platforms() || 'H5'
			})
			if(result.code === 1) {
				commit("setConfig", result.data)
				
				if(utils.platforms() === 'wxOfficialAccount' || utils.platforms() === 'wxMiniProgram') {
					commit("setAppid", result.data.wechat.appid)
				}
	
				const isIos = uni.getSystemInfoSync().osName == 'ios' ? true : false
				const apay = result.data.apple_pay == 0 ? false : true
				commit("setIosIsPay", !apay && isIos ? false : true)
				commit("setTitle", result.data.system.name)
				commit("setCopyright", result.data.system.copyright)
				commit("setRichtext", result.data.system)
				
				// #ifdef H5
				document.title = result.data.system.name
				
				if(utils.platforms() === 'wxOfficialAccount') {
					commit("setVideoAutoplay", result.data.system.android_autoplay)
				}
				
				// utils.platforms() == 'wxOfficialAccount' && dispatch('getWxShareConfigInfo')
				// utils.platforms() == 'wxOfficialAccount' && wxoaShare()
				// #endif
				
				return result.data
			}
			return false
		},
		// 微信分享配置信息
		async getWxShareConfigInfo({ commit, dispatch, getters, state }) {
			// #ifdef H5
			const spm = store.state.user.userInfo?.id ? `${store.state.user?.userInfo?.id}.1.0.2.1` : ""
			const title = state.config?.share?.title ? state.config?.share?.title : ""
			const imgUrl = state.config?.share?.image ? state.config?.share?.image : ""
			const desc = state.config?.share?.description ? state.config?.share?.description : ""
			const uri = window.location.origin + window.location.pathname
			const link = uri + `?${SIGN}#/pages/home/index?scene=${spm}`
			
			request('user.share', { uri }).then(res => {
				if(res.code === 1) {
					console.log("获取分享配置");
					jweixin.config({
						debug: false,
						appId: res.data.appId,
						nonceStr: res.data.nonceStr,
						timestamp: res.data.timestamp,
						signature: res.data.signature,
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
						]
					})
					jweixin.ready(() => {
						// true(已登录) false(未登录)
						commit('setJwx', spm ? true : false)
						// 分享给朋友
						jweixin.updateAppMessageShareData({ 
							title,
							desc,
							link,
							imgUrl,
							success: e => {
								console.log("分享好友");
							}
						})
						// 分享朋友圈
						jweixin.updateTimelineShareData({
							title,
							link,
							imgUrl,
							success: e => {
								console.log("分享朋友圈");
							}
						})
					})
					jweixin.error(err => {
						console.log(err, "微信分享config配置失败");
					})
				}
			})
			// #endif
		}
	}
}