export type Avater = 'white' | 'red' | 'blue' | 'green' | 'black'

export interface Player {
    id: string
    name: string
    type: Avater
    position: number[]
    rotation: number[]
}
