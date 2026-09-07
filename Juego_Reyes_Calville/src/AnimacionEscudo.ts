import * as ecs from '@8thwall/ecs'

const ESCUDO = 'CartaEscudo'

const DEFENSA = 'defensa'

ecs.registerComponent({
  name: 'Guerrero Escudo',

  stateMachine: ({world, eid}) => {
    ecs.defineState('default')
      .initial()
      .listen(world.events.globalId, ecs.events.REALITY_IMAGE_FOUND, (event: any) => {
        if (event.data.name === ESCUDO) {
          ecs.GltfModel.mutate(world, eid, (cursor) => {
            cursor.animationClip = DEFENSA
            cursor.paused = false
            cursor.loop = true
            cursor.crossFadeDuration = 0.3
            return false
          })
        }
      })
  },
})
