const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/CartaEspada.json'),
      require('../image-targets/CartaEscudo.json'),
      require('../image-targets/EnfretamientoEspada.json'),
      require('../image-targets/cartamadera.json'),
      require('../image-targets/Merged.json'),
      require('../image-targets/cartavarita.json'),
      require('../image-targets/Video.json'),
      require('../image-targets/cartamadera-1.json'),
      require('../image-targets/carta_piedra.json'),
      require('../image-targets/carta_piedra_preciosa.json'),

    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)