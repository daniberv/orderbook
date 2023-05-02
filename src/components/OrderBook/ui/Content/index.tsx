import Asks from '@/ui/Asks'
import Bids from '@/ui/Bids'

import Styled from './index.styled'

const Content = () => {
	return (
		<>
			<Asks />
			<Styled.Divider />
			<Bids />
		</>
	)
}

export default Content
