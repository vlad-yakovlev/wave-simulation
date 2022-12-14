import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'
import { useRaf } from '../hooks/useRaf'

export interface DemoComponentProps {
  width: number
  height: number
  scale: number
  speed: number
  initShader?: string
  iterateShader?: string
  drawShader?: string
}

export const DemoComponent: FC<DemoComponentProps> = ({
  width,
  height,
  scale,
  speed,
  initShader,
  iterateShader,
  drawShader,
}) => {
  const root = useRef<HTMLDivElement>(null)
  const fieldImage = useRef<FieldImage>()

  useRaf(
    useCallback(() => {
      if (!fieldImage.current) {
        if (!root.current) throw new Error('Could not get root ref')

        fieldImage.current = new FieldImage({
          root: root.current,
          width,
          height,
          scale,
          initShader,
        })
      }

      for (let i = 0; i < speed; i++) fieldImage.current.iterate(iterateShader)
      fieldImage.current.draw(drawShader)
    }, [drawShader, width, height, scale, initShader, speed, iterateShader])
  )

  useEffect(() => {
    fieldImage.current?.destroy()
    fieldImage.current = undefined
  }, [width, height, scale, initShader])

  return <div ref={root} />
}
