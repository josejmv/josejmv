// styles
import classes from 'styles/home/styles.module.scss'

// types
import type { NextPage } from 'next'

const Home: NextPage = () => (
  <div className={classes.container}>
    <main className={classes.main}>
      <h1 className={classes.title}>
        Welcome to <span>Next.js!</span>
      </h1>
    </main>
  </div>
)

export default Home
