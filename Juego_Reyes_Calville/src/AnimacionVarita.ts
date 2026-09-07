import * as ecs from '@8thwall/ecs'

const VARITA = 'cartavarita'   // el image target de la varita
const ESCUDO = 'cartaescudo'   // el image target del escudo, confirma el nombre real

ecs.registerComponent({
  name: 'Animacion Varita',
  stateMachine: ({world, eid}) => {
    const clip = (nombre, bucle) => {
      ecs.GltfModel.mutate(world, eid, (cursor) => {
        cursor.animationClip = nombre
        cursor.paused = false
        cursor.loop = bucle
        cursor.crossFadeDuration = 0.3
        return false
      })
    }
    ecs.defineState('default').initial()
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_FOUND, (event: any) => {
        if (event.data.name === VARITA) clip('AtaqueVarita', true)
        if (event.data.name === ESCUDO) clip('Die', false)
      })
  },
})