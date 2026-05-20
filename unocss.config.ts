import { webRemConfig } from '@lincy/unocss-base-config'
import { fontSize } from './src/design.config'

export default webRemConfig({ baseFontSize: fontSize }, 'wind3', { preflight: 'on-demand' })
