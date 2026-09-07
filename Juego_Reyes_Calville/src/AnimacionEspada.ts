import * as ecs from '@8thwall/ecs'

const ESPADA = 'CartaEspada'
const ESCUDO = 'CartaEscudo'

const ATAQUE = 'ataque'
const MUERTE = 'muerte'

ecs.registerComponent({
  name: 'Guerrero Espada',

  stateMachine: ({world, eid}) => {
    let verEspada = false
    let verEscudo = false

    const ponerClip = (clip, enBucle) => {
      ecs.GltfModel.mutate(world, eid, (cursor) => {
        cursor.animationClip = clip
        cursor.paused = false
        cursor.loop = enBucle
        cursor.crossFadeDuration = 0.3
        return false
      })
    }

    const actualizar = () => {
      if (verEspada && verEscudo) {
        ponerClip(MUERTE, false)
      } else if (verEspada) {
        ponerClip(ATAQUE, true)
      }
    }

    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_FOUND, (event: any) => {
        if (event.data.name === ESPADA) verEspada = true
        if (event.data.name === ESCUDO) verEscudo = true
        actualizar()
      })
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_LOST, (event: any) => {
        if (event.data.name === ESPADA) verEspada = false
        if (event.data.name === ESCUDO) verEscudo = false
        actualizar()
      })
  },
})