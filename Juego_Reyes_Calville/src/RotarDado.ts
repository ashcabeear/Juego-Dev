import * as ecs from '@8thwall/ecs'

const DUELO = 'EnfrentamientoEspada'   // nombre EXACTO del image target combinado
const GIRO_MS = 1600

ecs.registerComponent({
  name: 'Duelo Espadas',
  stateMachine: ({world, eid}) => {
    const girar = () => {
      ecs.Hidden.remove(world, eid)
      ecs.RotateAnimation.set(world, eid, {
        fromX: 0, fromY: 0, fromZ: 0, toX: 360, toY: 720, toZ: 360,
        duration: 600, loop: true, reverse: false,
      })
    }
    const esconder = () => {
      ecs.RotateAnimation.remove(world, eid)
      ecs.Hidden.set(world, eid, {})
    }

    ecs.defineState('espera').initial()
      .onEnter(esconder)
      .onEvent(ecs.events.REALITY_IMAGE_FOUND, 'girando', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('girando')
      .onEnter(girar)
      .wait(GIRO_MS, 'resultado')
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'espera', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })

    ecs.defineState('resultado')
      .onEnter(() => {
        ecs.RotateAnimation.remove(world, eid)
        const perdedor = Math.random() < 0.5 ? 'uno' : 'dos'
        world.events.dispatch(world.events.globalId, 'dueloResultado', {perdedor})
      })
      .onEvent(ecs.events.REALITY_IMAGE_LOST, 'espera', {
        target: world.events.globalId, where: (e: any) => e.data.name === DUELO,
      })
  },
})
