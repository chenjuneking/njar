import path from 'path'
import { executeClassWithCP, executeJar, install } from '../src'

describe('Test index.ts', () => {
  test('#install() - it should return 0 if system java exists', async () => {
    const result = await install(8, {
      type: 'jre',
      allow_system_java: true,
      registry: 'http://localhost:8080',
    })
    expect(result).toEqual(0)
  })

  test('#install() - it should return 1 if install sucussfully', async () => {
    const result = await install(8, {
      type: 'jre',
      allow_system_java: false,
      registry: 'http://localhost:8080',
    })
    expect(result).toEqual(1)
  })

  test('#executeJar()', async () => {
    const jarPath = path.join(__dirname, './fixtures/example/Math/Math.jar')
    const args = ['add', '21', '32']
    const result = await executeJar(jarPath, args)
    expect(result).toEqual('53')
  })

  test('#executeClassWithCP()', async () => {
    const className = 'App.Main'
    const classPaths = path.join(__dirname, './fixtures/example/Math')
    const args = ['add', '21', '32']
    const result = await executeClassWithCP(className, classPaths, args)
    expect(result).toEqual('53')
  })

  test('JBCrypt#hashpw() and JBCrypt#checkpw()', async () => {
    const jarPath = path.join(
      __dirname,
      './fixtures/example/JBCrypt/JBCrypt.jar'
    )
    const hashed = await executeJar(jarPath, ['hashpw', 'foobar'])
    expect(hashed.startsWith('$')).toBe(true)

    const r1 = await executeJar(jarPath, ['checkpw', '123456', hashed])
    expect(r1).toBe('false')

    const r2 = await executeJar(jarPath, ['checkpw', 'foobar', hashed])
    expect(r2).toBe('true')
  })
})