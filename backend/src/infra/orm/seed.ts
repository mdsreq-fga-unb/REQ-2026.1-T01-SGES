import { dataSource } from './datasource'
import { UserEntity } from './entity/user-entity'
import { UserRole } from '@/domain'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Iniciando o seeding do banco de dados...')
  
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const userRepository = dataSource.getRepository(UserEntity)

  // Seed Admin
  const adminEmail = 'admin@sges.com'
  const existingAdmin = await userRepository.findOneBy({ email: adminEmail })
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Senha123!', 10)
    const admin = userRepository.create({
      registerCode: '000001',
      name: 'Carlos Gestor',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    })
    await userRepository.save(admin)
    console.log(`Usuário admin criado: ${adminEmail}`)
  } else {
    console.log(`Usuário admin já existe: ${adminEmail}`)
  }

  // Seed Volunteer / Teacher
  const volunteerEmail = 'volunteer@sges.com'
  const existingVolunteer = await userRepository.findOneBy({ email: volunteerEmail })
  if (!existingVolunteer) {
    const hashedPassword = await bcrypt.hash('Senha123!', 10)
    const volunteer = userRepository.create({
      registerCode: '000002',
      name: 'Maria Instrutora',
      email: volunteerEmail,
      password: hashedPassword,
      role: UserRole.TEACHER,
    })
    await userRepository.save(volunteer)
    console.log(`Usuário volunteer criado: ${volunteerEmail}`)
  } else {
    console.log(`Usuário volunteer já existe: ${volunteerEmail}`)
  }

  await dataSource.destroy()
  console.log('Seeding concluído com sucesso!')
}

seed().catch((err) => {
  console.error('Erro no seeding:', err)
  process.exit(1)
})
