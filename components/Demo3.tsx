import { FC, useCallback, useEffect, useRef } from 'react'
import { FieldImage } from '../classes/FieldImage'

export const Demo3: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldImage = useRef<FieldImage>()

  const run = useCallback((currentFieldImage: FieldImage) => {
    if (fieldImage.current === currentFieldImage && canvas.current) {
      currentFieldImage.iterate()
      currentFieldImage.draw(canvas.current, 'height')
      window.requestAnimationFrame(() => run(currentFieldImage))
    }
  }, [])

  const init = useCallback(() => {
    let { width, height } = document.documentElement.getBoundingClientRect()
    const scale = window.devicePixelRatio
    width = Math.floor(width * scale)
    height = Math.floor(height * scale)

    // iOS scroll triggers resize, ignore it
    if (
      fieldImage.current?.width === width &&
      fieldImage.current?.height === height
    ) {
      return
    }

    fieldImage.current = new FieldImage(width, height)

    fieldImage.current.setUpdateMass(function () {
      if (this.frame === 0) {
        if (
          this.x === 0 ||
          this.y === 0 ||
          this.x === this.width - 1 ||
          this.y === this.height - 1 ||
          Math.abs(this.x - (this.width - 1) / 2) <= 1.5 ||
          Math.abs(this.y - (this.height - 1) / 2) <= 1.5
        ) {
          return 0
        }

        return 1
      }

      return this.pixelMass[this.x][this.y]
    })

    fieldImage.current.setUpdateHeight(function () {
      if (this.frame === 0) {
        if (
          (Math.abs(this.x - (this.width - 1) / 2) <= 1.5 &&
            Math.abs(this.y - (this.height - 1) / 2) <
              Math.min(this.width, this.height) / 4) ||
          (Math.abs(this.y - (this.height - 1) / 2) <= 1.5 &&
            Math.abs(this.x - (this.width - 1) / 2) <
              Math.min(this.width, this.height) / 4)
        ) {
          return 1
        }

        return 0
      }

      return this.pixelHeight[this.x][this.y][this.i]
    })

    run(fieldImage.current)
  }, [run])

  useEffect(() => {
    init()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
    }
  }, [init])

  return <canvas className="w-full h-full" ref={canvas} />
}