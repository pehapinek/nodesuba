import React from "react";
import ReplyType from '../interfaces/ReplyType';
import PostHeader from './PostHeader'

interface Props {
  reply: ReplyType
}

const Reply: React.FunctionComponent<Props> = ({reply}) => {
  return(
    <div style={{
    background: '#343439',
    margin: '15px',
    marginRight: '10px',
    marginLeft: '22px',
    maxWidth: '100ch',
    overflow:'hidden',
    border: '2px solid #3070a9',
    fontSize: '10pt',
    textAlign: 'justify',
    width: 'fit-content',
    minWidth: '200px',
    borderRadius: '5px'
    }}>
      <PostHeader createdAt={reply.createdAt} id={reply.id} isPost={false}/>
      <p style={{
        margin: '20px'
      }}>
        {reply.content}
      </p>
    </div>
  );
};

export default Reply;
