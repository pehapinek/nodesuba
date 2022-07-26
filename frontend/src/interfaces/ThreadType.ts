import Reply from './ReplyType'

interface ThreadType {
  id: number,
  createdAt: string,
  name: string | null,
  email: string | null,
  content: string | null,
  isPinned: boolean,
  repliesCount: number,
  replies: Reply[]
}

export default ThreadType;
