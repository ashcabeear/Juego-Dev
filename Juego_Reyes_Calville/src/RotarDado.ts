import * as ecs from '@8thwall/ecs'

const DUELO = 'CartaEspada'   // confirma el nombre real con la linea espia
const GIRO_MS = 1200

ecs.registerComponent({
  name: 'Duelo Espadas',
  schema: {
    guerrero2: ecs.eid,   // arrastra Guerrero_Enfrentamiento2
    opciones: ecs.eid,    // arrastra Contenedor (Menor, Igual, Mayor)
    botonLanzar: ecs.eid, // arrastra iniduelo
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const s = () => schemaAttribute.get(eid)
    const mostrar = (target, si) => {
      if (!target) return
      si ? ecs.Hidden.remove(world, target) : ecs.Hidden.set(world, target, {})
    }
    const rodar = () => {
      mostrar(eid, true)
      const g90 = () => 90 * Math.floor(Math.random() * 4)
      ecs.RotateAnimation.set(world, eid, {
        autoFrom: true,
        toX: g90() + 720, toY: g90() + 720, toZ: g90() + 720,
        duration: GIRO_MS, loop: false, easeOut: true,
      })
    }

    // sin carta: todo apagado
    ecs.defineState('sinCarta').initial()
      .onEnter(() => {
        mostrar(eid, false)
        mostrar(s().guerrero2, false)
        mostrar(s().opciones, false)
        mostrar(s().botonLanzar, false)
      })
      .onEvent(ecs.events.REALITY_IMAGE_FOUND, 'listo', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    // hay carta: guerrero 1 (solo, ya visible) + boton lanzar
    ecs.defineState('listo')
      .onEnter(() => {
        mostrar(eid, false)
        mostrar(s().guerrero2, false)
        mostrar(s().opciones, false)
        mostrar(s().botonLanzar, true)
      })
      .onEvent('lanzarDuelo', 'girando', {target: world.events.globalId})
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'sinCarta', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    // se presiono lanzar: aparece guerrero 2 y el dado rueda
    ecs.defineState('girando')
      .onEnter(() => {
        mostrar(s().botonLanzar, false)
        mostrar(s().guerrero2, true)
        rodar()
      })
      .wait(GIRO_MS, 'elegir')
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'sinCarta', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    // el dado cayo: salen los 3 botones
    ecs.defineState('elegir')
      .onEnter(() => { mostrar(s().opciones, true) })
      .onEvent('dueloOpcion', 'girando', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'igual',
      })
      .onEvent('dueloOpcion', 'muereUno', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'mayor',
      })
      .onEvent('dueloOpcion', 'muereDos', {
        target: world.events.globalId, where: (e: any) => e.data.opcion === 'menor',
      })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'sinCarta', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('muereUno')
      .onEnter(() => {
        mostrar(s().opciones, false)
        world.events.dispatch(world.events.globalId, 'muereGuerrero', {lado: 'uno'})
      })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'sinCarta', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('muereDos')
      .onEnter(() => {
        mostrar(s().opciones, false)
        world.events.dispatch(world.events.globalId, 'muereGuerrero', {lado: 'dos'})
      })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'sinCarta', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })
  },
})