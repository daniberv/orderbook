import { useContext } from 'react'

import { SocketContext } from '@/contexts/socket_context'

const useSocket = () => useContext(SocketContext)

export default useSocket
