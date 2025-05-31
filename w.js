function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

var WebviewPlayer = {
  _resetCss() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style')
    stylesheets.forEach(sheet => sheet.remove())

    const elements = document.querySelectorAll('*')
    elements.forEach(element => {
      element.removeAttribute('style')
    })
  },

  _getVideoEl() {
    return document.querySelector('video')
  },

  async _waitVideoReady() {
    while (true) {
      const videoEl = this._getVideoEl()
      if (videoEl) return videoEl
      await delay(100)
    }
  },

  async _fullscreenVideo() {
    const videoEl = this._getVideoEl()
    videoEl.style = 'position: fixed; left: -1px; top: -1px; height: calc(100vh + 2px); width: calc(100vw + 2px); z-index: 99999; background: black;'

    for (const child of document.body.children) {
      child.style['z-index'] = -1
    }
  },

  async initialize() {
    await this._waitVideoReady()

    await _WebviewPlayer_hostInitialize[location.host]?.()

    this._resetCss()
    this._fullscreenVideo()

    const videoEl = this._getVideoEl()
    videoEl.addEventListener('play', () => {
      PlayerWebViewInterface.changeIsPlaying(true)
    })

    videoEl.addEventListener('pause', () => {
      PlayerWebViewInterface.changeIsPlaying(false)
    })

    videoEl.addEventListener('timeupdate', () => {
      PlayerWebViewInterface.changeCurrentPosition(Math.floor(videoEl.currentTime * 1000))
    })

    videoEl.volume = 1
    videoEl.autoplay = true

    await delay(500)
    if (videoEl.paused) videoEl.play()

    while (true) {
      await delay(500)
      if (videoEl.videoWidth * videoEl.videoHeight == 0) continue

      PlayerWebViewInterface.changeResolution(videoEl.videoWidth, videoEl.videoHeight)
      break
    }

    while (true) {
      await delay(500)
      if (videoEl.volume != 0) break
      videoEl.volume = 1
    }
  },

  release() {

  },

  play() {
    document.querySelector('video')?.play()
  },

  pause() {
    document.querySelector('video')?.pause()
  },

  stop() {
    this.pause()
  },

  seekToP(position) {

  },

  setVolume(volume) {
    const videoEl = document.querySelector('video')
    if (videoEl) videoEl.volume = volume
  },
}

var _WebviewPlayer_hostInitialize = {
  "live.snrtv.com": async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const channel = urlParams.get('channel')

    let liList = document.querySelectorAll('.btnStream > li')
    for (const li of liList) {
      if (li.innerText.includes(channel)) {
        li.click()
        break
      }
    }
  },

  "live.jstv.com": async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const channel = urlParams.get('channel')

    let liList = document.querySelector('#programMain')?.querySelectorAll('.swiper-slide') || []
    for (const li of liList) {
      if (li.innerText.includes(channel)) {
        li.querySelector('.imgBox')?.click()
        break
      }
    }
  },

  "www.nbs.cn": async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const channel = urlParams.get('channel')

    let liList = document.querySelectorAll('.tv_list > .tv_c')
    for (const li of liList) {
      if (li.innerText.includes(channel)) {
        li.click()
        break
      }
    }
  },

  "www.brtn.cn": async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const channel = urlParams.get('channel')

    let liList = document.querySelectorAll('.right_list li')
    for (const li of liList) {
      if (li.innerText.includes(channel)) {
        li.click()
        break
      }
    }
  },
}
