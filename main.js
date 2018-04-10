(function (d) {
  const colorIsotipo = d.getElementById('color-isotipo')
  const colorLogotipo = d.getElementById('color-logotipo')
  const widthInput = d.getElementById('width')
  const widthRangeInput = d.getElementById('width-range')
  const downloadLink = d.getElementById('download')
  const isotipos = d.querySelectorAll('.isotipo')
  const logotipos = d.querySelectorAll('.logotipo')
  const canvas = d.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = d.createElement('img')
  const logoOptions = d.querySelectorAll('.controls__logos__item img')
  const previewLogos = d.querySelectorAll('.preview__logo')
  
  let selectedSvg = d.getElementById('logo1').querySelector('svg')
  let mousedown = false

  const svgData = () => new XMLSerializer().serializeToString(selectedSvg)
  
  const updateCtx = () => {
    ctx.drawImage(img, 0, 0)
    downloadLink.download = 'logo-utn.png'
    downloadLink.href = canvas.toDataURL('image/png')
  }
  
  const updateCanvasSize = () => {
    canvas.width = selectedSvg.getBoundingClientRect().width
    canvas.height = selectedSvg.getBoundingClientRect().height
  }
  
  const updateImgSource = () => {
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData())
  }

  const updateSvgSize = () => {
    const width = selectedSvg.getBoundingClientRect().width
    const height = selectedSvg.getBoundingClientRect().height
    selectedSvg.setAttribute('width', widthInput.value)
    selectedSvg.setAttribute('height', height * widthInput.value / width)
  }

  const invertColor = (hex, bw) => {
    if (hex.indexOf('#') === 0)
      hex = hex.slice(1)

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3)
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]

    if (hex.length !== 6)
      throw new Error('Invalid HEX color.')

    let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16)

    if (bw)
      // http://stackoverflow.com/a/3943023/112731
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF'

    // invert color components
    r = (255 - r).toString(16)
    g = (255 - g).toString(16)
    b = (255 - b).toString(16)

    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b)
  }

  const padZero = (str, len) => {
    len = len || 2
    var zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
  }
  
  updateCanvasSize()
  updateImgSource()
  
  img.onload = updateCtx

  widthRangeInput.addEventListener('click', updateWidth)
  widthRangeInput.addEventListener('mousemove', (e) => mousedown && updateWidth(e))
  widthRangeInput.addEventListener('mousedown', () => mousedown = true)
  widthRangeInput.addEventListener('mouseup', () => mousedown = false)
  
  colorIsotipo.addEventListener('change', () => {
    isotipos.forEach(isotipo => isotipo.style.setProperty('fill', colorIsotipo.value))
    colorIsotipo.parentElement.style.backgroundColor = colorIsotipo.value
    colorIsotipo.parentElement.style.color = invertColor(colorIsotipo.value, true)
    updateImgSource()
  })
  
  colorLogotipo.addEventListener('change', () => {
    logotipos.forEach(logotipo => logotipo.style.setProperty('fill', colorLogotipo.value))
    colorLogotipo.parentElement.style.backgroundColor = colorLogotipo.value
    colorLogotipo.parentElement.style.color = invertColor(colorLogotipo.value, true)
    updateImgSource()
  })
  
  widthInput.addEventListener('change', () => {
    widthRangeInput.value = widthInput.value
    updateSvgSize()
    updateCanvasSize()
    updateImgSource()
  })

  function updateWidth(e) {
    widthInput.value = widthRangeInput.value
    updateSvgSize()
    updateCanvasSize()
    updateImgSource()    
  }
  
  widthRangeInput.addEventListener('change', updateWidth)

  logoOptions.forEach(option => option.addEventListener('click', function () {
    const logoDiv = d.getElementById('logo' + this.dataset.logo)
    const logoSvg = logoDiv.querySelector('svg')
    console.log(this)
    previewLogos.forEach(l => l.classList.remove('preview__logo--active'))
    logoDiv.classList.add('preview__logo--active')

    selectedSvg = logoSvg
    updateSvgSize()
    updateCanvasSize()
    updateImgSource()
  }))

})(document)