import * as ecs from '@8thwall/ecs'

const DUELO = 'EnfrentamientoEspada'

ecs.registerComponent({
  name: 'Guerrero Enfrentamiento',
  schema: {
    lado: ecs.string,   // "uno" en Guerrero_Enfrentamiento1, "dos" en Guerrero_Enfrentamiento2
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
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
        if (event.data.name === DUELO) clip('ataque', true)
      })
      .listen(world.events.globalId, 'muereGuerrero', (event: any) => {
        if (event.data.lado === schemaAttribute.get(eid).lado) clip('muerte', false)
      })
  },
})