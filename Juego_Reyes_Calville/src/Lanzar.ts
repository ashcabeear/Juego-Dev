import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Boton Lanzar',
  stateMachine: ({world, eid}) => {
    ecs.defineState('default').initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        world.events.dispatch(world.events.globalId, 'lanzarDuelo', {})
      })
  },
})