import Dayjs from 'dayjs'
import songsData from '../../mock/songsData'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: '',
        isPlay: true,
        isShowList: false,
        songsData: '',
        playNow: {},
        songIndex: 0,
        playMode: 1, // 1: 单曲 2: 顺序 3: 随机
        currentTime: '00:00',
        durationTime: '03:43',
        currentPosition: 0
    },
    // 循环模式切换
    handleSongMode() {
        this.setData({
            playMode: this.data.playMode + 1
        })
        if (this.data.playMode > 3) {
            this.setData({
                playMode: 1
            })
        }

    },
    // 暂停播放
    handlePlayStop() {
        this.setData({
            isPlay: !this.data.isPlay
        })
        if (this.data.isPlay) {

            this.bgMusic.play()
        } else {
            this.bgMusic.pause()
        }
    },
    // 切换音乐
    handleNextPreSong(evt) {
        let {
            songsData,
            playMode
        } = this.data
        let preOrNextIndex = playMode === 3 ? Math.floor(Math.random() * songsData.length) : evt.target.dataset.preornextindex + this.data.songIndex

        while (preOrNextIndex === this.data.songIndex) {
            preOrNextIndex = Math.floor(Math.random() * songsData.length)
        }
        this.setData({
            songIndex: preOrNextIndex
        })

        if (this.data.songIndex > songsData.length - 1) {
            this.setData({
                songIndex: 0
            })
        }
        if (this.data.songIndex < 0) {
            this.setData({
                songIndex: songsData.length - 1
            })
        }
        this.setData({
            playNow: songsData[this.data.songIndex],
            isPlay: true,
            currentPosition: 0
        })
        this.playSong()
    },
    // 音乐列表
    handleShowSongList() {
        this.setData({
            isShowList: !this.data.isShowList
        })
    },
    handleHideSongList() {
        this.setData({
            isShowList: false
        })
    },
    // 选择播放音乐
    handleChooseSong(evt) {
        let index = evt.currentTarget.dataset.index
        console.log(index, evt);
        this.setData({
            songIndex: index,
            playNow: songsData[index],
            isPlay: true,
            isShowList: false,
            currentPosition: 0
        })
        this.playSong()
    },
    // 控制进度条事件
    // handleStopFlashStart() {
    //     this.stopFlashing = false
    // },
    // handleStopFlashStop() {
    //     this.stopFlashing = true
    // },
    handleSlider(evt) {
        let scale = evt.detail.value / 440
        let nowTime = this.durationTime * scale
        this.bgMusic.seek(nowTime)
        this.setData({
            currentPosition: evt.detail.value,
            currentTime: Dayjs(Math.floor(nowTime) * 1000).format("mm:ss"),
        })
    },
    playSong() {
        let {
            src,
            name
        } = this.data.playNow
        this.bgMusic.src = src
        this.bgMusic.title = name

    },
    getSongsTimes() {
        this.durationTime = Math.floor(this.bgMusic.duration)
        this.currentTime = Math.floor(this.bgMusic.currentTime)
        this.scale = this.currentTime / this.durationTime * 440
    },
    // 背景音乐监听
    musicListen() {
        this.bgMusic.onTimeUpdate(() => {
            this.getSongsTimes()
            this.setData({
                currentPosition: this.scale,
                currentTime: Dayjs(this.currentTime * 1000).format("mm:ss"),
                durationTime: Dayjs(this.durationTime * 1000).format("mm:ss")
            })
            // if (!this.stopFlashing) return
            // this.setData({
            //     currentPosition: this.scale,
            // })
        })
        this.bgMusic.onEnded(() => {
            let selfEnd = this.data.playMode === 3 ? Math.floor(Math.random() * songsData.length) : this.data.songIndex
            selfEnd = this.data.playMode === 2 ? ++selfEnd : selfEnd
            this.setData({
                playNow: songsData[selfEnd],
                isPlay: true
            })
            this.playSong()
        })
        this.bgMusic.onStop(() => {
            this.setData({
                isPlay: false
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            songsData: songsData,
        })
        this.setData({
            playNow: this.data.songsData[this.data.songIndex]
        })
        this.bgMusic = wx.getBackgroundAudioManager()
        this.stopFlashing = true
        this.playSong()
        this.musicListen()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})