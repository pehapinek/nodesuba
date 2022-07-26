interface ReplyBodyType {
  parentId: number | undefined | string,
  boardId: string | undefined,
  name: string,
  content: string,
  password: string,
  email: string
}

export default ReplyBodyType;
