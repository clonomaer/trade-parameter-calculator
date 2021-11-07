import { ValueTypeOfKey } from 'types'
import { ImageProps } from 'next/image'

export type ClassName = string | { [className: string]: boolean } | ClassName[]
export type ImageSrc = ValueTypeOfKey<ImageProps, 'src'>
