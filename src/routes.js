import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title , description } = req.body

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title is required' }),
        )
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'description is required' })
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
  
      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search }= req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'), //sempre que tiver um ':' receberá um valor dinâmico
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) { // Sem essa validação, seria possível criar ou atualizar tarefas sem título ou descrição, o que pode levar a dados inválidos ou confusos.
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        update_at: new Date()      
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'), //sempre que tiver um ':' receberá um valor dinâmico
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },

  {
    method: 'PATCH', // Avalia se a tarefa foi concluída ou não.
    path: buildRoutePath('/tasks/:id'), //sempre que tiver um ':' receberá um valor dinâmico
    handler: (req, res) => {
      const { id } = req.params
      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      const isTaskCompleted = !!task.completed_at // A dupla exclamação (!!) é um truque em JavaScript usado para converter qualquer valor em um booleano explícito
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })

      return res.writeHead(204).end()
    },
  }
]