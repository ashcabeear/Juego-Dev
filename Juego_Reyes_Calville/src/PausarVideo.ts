import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Pausar Video',
  schema: {
    videoEntity: ecs.eid,   // el plano con el video
    iconoPlay: ecs.eid,     // Icon_Play
    iconoPause: ecs.eid,    // Icon_Pause
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const s = () => schemaAttribute.get(eid)
    const mostrar = (target, visible) => {
      if (!target) return
      visible ? ecs.Hidden.remove(world, target) : ecs.Hidden.set(world, target, {})
    }
    const ponerPausa = (valor) => {
      const {videoEntity} = s()
      if (!videoEntity) return
      ecs.VideoControls.mutate(world, videoEntity, (cursor) => {
        cursor.paused = valor
        return false
      })
    }

    // El video arranca reproduciendo (Autoplay esta activo)
    ecs.defineState('reproduciendo')
      .initial()
      .onEnter(() => {
        ponerPausa(false)
        mostrar(s().iconoPause, true)   // mientras reproduce, ofreces pausar
        mostrar(s().iconoPlay, false)
      })
      .listen(eid, ecs.input.UI_CLICK, () => {})   // el clic dispara el cambio de estado abajo
      .onEvent(ecs.input.UI_CLICK, 'pausado', {target: eid})

    ecs.defineState('pausado')
      .onEnter(() => {
        ponerPausa(true)
        mostrar(s().iconoPlay, true)    // mientras pausado, ofreces reproducir
        mostrar(s().iconoPause, false)
      })
      .onEvent(ecs.input.UI_CLICK, 'reproduciendo', {target: eid})
  },
})