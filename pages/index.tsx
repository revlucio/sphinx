import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState} from "react";

const Home: NextPage = () => {
    const [endpoints, setEndpoints] = useState<any[]>([])
    const [name, setName] = useState<string|null>(null)
    const [url, setUrl] = useState<string|null>(null)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Sphinx
        </h1>
      </main>

        <button>Register endpoint</button>

        <label>Name<input type="text" onChange={(e) => setName(e.target.value)} /></label>
        <label>URL<input type="text" onChange={(e) => setUrl(e.target.value)} /></label>
        <button onClick={() => setEndpoints(prev => prev.concat([{name, url}]))}>Create</button>

        {endpoints.map(endpoint =>
            <div>
                <h2>{endpoint.name}</h2>
                <h2>{endpoint.url}</h2>
            </div>
        )}

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
