interface PostBody {
  boardId: string | undefined
  name: string | undefined,
  content: string | undefined,
  password: string | undefined,
  email: string | undefined,
  parentId ? : number
}

export default PostBody;

