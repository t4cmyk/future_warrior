import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
} from 'react-bootstrap';
import { getToken, getUsername } from '../../core/authentication';
import { getTeamMemberNamesByTeamId } from '../../../../server/src/database/team';

type OnChatUpdateHandler = (entries: IChatEntry[]) => any;
let chatData: IChatEntry[] = [];
const onChatListener: OnChatUpdateHandler[] = [];

function onChatData(entries: IChatEntry[]) {
  chatData = entries;
  onChatListener.forEach((callback) => callback(entries));
}

function addOnChatListener(handler: OnChatUpdateHandler) {
  onChatListener.push(handler);
}

function removeOnChatListener(handler: OnChatUpdateHandler) {
  const idx = onChatListener.indexOf(handler);
  if (idx >= 0) {
    onChatListener[idx] = onChatListener[onChatListener.length - 1];
    onChatListener.pop();
  }
}

interface IChatEntry {
  time: string;
  name: string;
  message: string;
}

function useChatEntries() {
  const [chatEntries, setChatEntries] = useState(chatData);
  useEffect(() => {
    addOnChatListener(setChatEntries);
    return () => removeOnChatListener(setChatEntries);
  }, []);

  return chatEntries;
}

function ChatEntry(props: { entry: IChatEntry }) {
  return (
    <ListGroup.Item
      className={props.entry.name === getUsername() ? 'text-right' : ''}
    >
      <span>{
        new Intl.DateTimeFormat('de-DE', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: 'numeric', minute: 'numeric', second: 'numeric',
        }).format(new Date(props.entry.time))
      }</span>
      <h5 className="text-capitalize">{props.entry.name}</h5>
      <span>{props.entry.message}</span>
    </ListGroup.Item>
  );
}

function TeamChat() {
  const inputRef = useRef<HTMLInputElement>();
  const dummyRef = useRef<HTMLDivElement>();
  const [last, _] = useState({ chatEntries: [] });
  const chatEntries = useChatEntries().reverse();

  useEffect(() => {
    const fetchChatMessages = async () => {
      const resp = await fetch(`/chat?token=${getToken()}`);
      const data = await resp.json();
      onChatData(data);
    };
    fetchChatMessages();
    const handle = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(handle);
  }, []);

  const onSendChat = async () => {
    const message = inputRef.current.value;
    const request: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: message,
    };
    const resp = await fetch(`/chat?&token=${getToken()}`, request);
    if (resp.ok) {
      const data = await resp.json();
      onChatData(data);
    }
    inputRef.current.value = '';
  };

  useEffect(() => {
    if (last.chatEntries.length < chatEntries.length)
      dummyRef.current.scrollIntoView();
    last.chatEntries = chatEntries;
  }, [chatEntries.length]);

  const listElements = chatEntries.map((entry) => (
    <ChatEntry
      key={entry.message + entry.name + entry.time.toString()}
      entry={entry}
    />
  ));
  listElements.push(<div key="dummy" ref={dummyRef}/>);

  return (
    <>
      <ListGroup className="chat-frame">{listElements}</ListGroup>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSendChat();
        }}
      >
        <InputGroup className="mb-3">
          <FormControl ref={inputRef} placeholder="Nachricht eintippen..."/>
          <InputGroup.Append>
            <Button type="submit" variant="secondary">
              Chat
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </>
  );
}

export function Chat() {
  return (
    <>
      <h1>Team-Chat</h1>
      <br/>
      {/*<h4>Mitglieder:innen - A, B, C, D</h4>*/}
      <br/>
      <Container>
        <TeamChat/>
      </Container>
      <br/>
    </>
  );
}
