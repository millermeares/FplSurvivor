import { auth0 } from "@/lib/auth0"
import axios from 'axios';

const url = 'https://x3araf0ma6.execute-api.us-east-2.amazonaws.com/prod/castaways';

const postData = async () => {
    try {
        const response = await axios.post(url, { /* Add your request body here if needed */ });
        console.log(response.data);
    } catch (e: any) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
};

export default async function Home() {
  await postData()
  const session = await auth0.getSession()
  
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">Sign up</a>
        <a href="/auth/login">Log in</a>
      </main>
    )
  }
  console.log(process.env.AUTH0_DOMAIN)
  console.log(session.user)
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <a href="/auth/logout">Log out</a>
    </main>
  )
}