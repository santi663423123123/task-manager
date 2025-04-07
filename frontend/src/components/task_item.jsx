import { Link } from 'react-router-dom';

export default function TaskItem({ task }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 text-sm text-gray-700">{task.id}</td>
      <td className="p-2">{task.title}</td>
      <td className="p-2">{task.status}</td>
      <td className="p-2">{task.priority}</td>
      <td className="p-2">{task.estimate ?? '-'}</td>
      <td className="p-2 text-sm text-gray-500">{new Date(task.createdAt).toLocaleString()}</td>
      <td className="p-2">
        <Link to={`/task/${task.id}`} className="text-blue-600 hover:underline text-sm">
          View
        </Link>
      </td>
    </tr>
  );
}
