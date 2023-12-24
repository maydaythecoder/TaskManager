import TaskList from '../components/TaskList'

export default function Home() {
  return (
<div className=' w-fit overflow-hidden'>
  <h1 className='mx-10 mt-4 mb-4 text-3xl font-bold font-sans'>Task manager</h1>
  <TaskList />
</div>
  )
}
