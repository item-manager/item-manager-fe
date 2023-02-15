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
}
export const PriorityProgressBar = ({
  priority = 0,
  strokeWidth = 10,
  gap = 20,
  color = '#F98600',
}: PriorityProgressBarType) => {
  const percentage = (priority / 6) * 100
  return (
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
  )
}
