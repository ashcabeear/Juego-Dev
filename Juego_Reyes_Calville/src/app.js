const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/CartaEspada.json'),
      require('../image-targets/CartaEscudo.json'),
      require('../image-targets/EnfretamientoEspada.json'),
      require('../image-targets/cartamadera.json'),
      require('../image-targets/Merged.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)