const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/CartaEspada.json'),
      require('../image-targets/CartaEscudo.json'),
      require('../image-targets/EnfrentamientoEspada.json'),
      require('../image-targets/cartamadera.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)