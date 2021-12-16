import { authMiddleware, postAuthentication } from "./authMiddleware";
import { errorMiddleware, notFoundMiddleware } from "./errorMiddleware";
import passport_config from './passport'
import headersAttachMiddleware from './headersAttachMiddleware'

const middleWares = {
  authMiddleware,
  postAuthentication,
  errorMiddleware,
  notFoundMiddleware,
  passport_config,
  headersAttachMiddleware
}

export default middleWares