import * as ecs from '@8thwall/ecs'

const DUELO = 'EnfrentamientoEspada'
const GIRO_MS = 1200

ecs.registerComponent({
  name: 'Duelo Espadas',
  schema: {
    opciones: ecs.eid,   // el Frame con los 3 botones
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const verOpciones = (mostrar) => {
      const o = schemaAttribute.get(eid).opciones
      if (!o) return
      mostrar ? ecs.Hidden.remove(world, o) : ecs.Hidden.set(world, o, {})
    }
    const rodar = () => {
      ecs.Hidden.remove(world, eid)
      const g90 = () => 90 * Math.floor(Math.random() * 4)
      ecs.RotateAnimation.set(world, eid, {
        autoFrom: true,
        toX: g90() + 720, toY: g90() + 720, toZ: g90() + 720,
        duration: GIRO_MS, loop: false, reverse: false,
        easeIn: false, easeOut: true,
      })
    }

    ecs.defineState('oculto').initial()
      .onEnter(() => { ecs.Hidden.set(world, eid, {}); verOpciones(false) })
      .onEvent(ecs.events.REALITY_IMAGE_FOUND, 'girando', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('girando')
      .onEnter(() => { verOpciones(false); rodar() })
      .wait(GIRO_MS, 'elegir')
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'oculto', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('elegir')
      .onEnter(() => { verOpciones(true) })
      .onEvent('dueloOpcion', 'girando', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'igual',
      })
      .onEvent('dueloOpcion', 'muereUno', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'mayor',
      })
      .onEvent('dueloOpcion', 'muereDos', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'menor',
      })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'oculto', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('muereUno')
      .onEnter(() => { verOpciones(false); world.events.dispatch(world.events.globalId, 'muereGuerrero', {lado: 'uno'}) })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'oculto', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('muereDos')
      .onEnter(() => { verOpciones(false); world.events.dispatch(world.events.globalId, 'muereGuerrero', {lado: 'dos'}) })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'oculto', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })
  },
})
