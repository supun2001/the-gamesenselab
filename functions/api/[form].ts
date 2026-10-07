import { handleForm, type Env } from '../../server/handler'
export const onRequest: PagesFunction<Env> = (context) =>
  handleForm(context.request, context.env, String(context.params.form))
