import {
  buildStyles,
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar'

export type PriorityProgressBarType = {
  priority?: number
  strokeWidth?: number
  gap?: number
  color?: string
  className?: string
  onChange?: (v: number) => void
}
export const PriorityProgressBar = ({
  priority = 0,
  strokeWidth = 10,
  gap = 20,
  color = 'rgb(249 115 22)',
  className = '',
  onChange,
}: PriorityProgressBarType) => {
  const percentage = (priority / 6) * 100
  return (
    <div
      className={className}
      onClick={() => {
        if (onChange) {
          onChange((priority + 1) % 7)
        }
      }}
    >
      <CircularProgressbarWithChildren
        value={100}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          pathColor: color,
          trailColor: 'transparent',
        })}
      >
        <div style={{ width: `${100 - 2 * strokeWidth - gap}%` }}>
          <CircularProgressbar
            value={percentage}
            strokeWidth={50}
            styles={buildStyles({
              strokeLinecap: 'butt',
              trailColor: 'transparent',
              pathColor: color,
            })}
          />
        </div>
      </CircularProgressbarWithChildren>
    </div>
  )
}
