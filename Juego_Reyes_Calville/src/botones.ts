import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Boton Duelo',
  schema: {
    opcion: ecs.string,   // escribe "mayor", "menor" o "igual" segun el boton
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default').initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        world.events.dispatch(world.events.globalId, 'dueloOpcion', {
          opcion: schemaAttribute.get(eid).opcion,
        })
      })
  },
})