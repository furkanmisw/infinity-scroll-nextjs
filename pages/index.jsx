import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";

const Home = ({ data }) => {
  const [todos, setTodos] = useState(data);

  useEffect(() => {
    const observer = new IntersectionObserver((enty) =>
      enty.forEach((e) => e.target.classList.toggle("show", e.isIntersecting))
    );
    const li = document.querySelectorAll("li");
    li.forEach((_li) => observer.observe(_li));
  }, [todos]);

  const listref = useRef();
  const [loading, setLoading] = useState(false);
  const [hasmore, setHasMore] = useState(true);
  const onscroll = () => {
    if (loading || !hasmore) return;
    const { scrollHeight, clientHeight, scrollTop } = listref.current;
    if (scrollHeight - (clientHeight + scrollTop + 70) <= 0) {
      setLoading(true);
      fetch("/api/hello?skip=" + todos.length)
        .then((res) => res.json())
        .then((res) => {
          setTodos((prev) => [...prev, ...res]);
          setHasMore(res.length === 20);
          setLoading(false);
        })
        .catch(() => setHasMore(false));
    }
  };
  return (
    <div>
      <Head>
        <title>Infinity Scroll</title>
      </Head>
      <h1>Todos</h1>
      <ul onScroll={onscroll} ref={listref}>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
        {hasmore ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="finish">
            <p>Finish...</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Home;

Home.getInitialProps = async () => {
  const url = process.env.CLIENT_URL || "http://localhost:3000";
  const res = await fetch(url + "/api/hello");
  const json = await res.json();
  return { data: json };
};
