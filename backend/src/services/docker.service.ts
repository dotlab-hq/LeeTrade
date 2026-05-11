import Docker from "dockerode";

const docker = new Docker(
  process.env.DOCKER_SOCKET_PATH
    ? { socketPath: process.env.DOCKER_SOCKET_PATH }
    : {
        host: process.env.DOCKER_HOST ?? "127.0.0.1",
        port: process.env.DOCKER_PORT ? Number(process.env.DOCKER_PORT) : 2375,
        protocol: (process.env.DOCKER_PROTOCOL as "http" | "https" | undefined) ?? "http",
      }
);

export const dockerService = {
  async ping() {
    await docker.ping();
    return { ok: true };
  },
  async listContainers(all: boolean) {
    return docker.listContainers({ all });
  },
  async cleanupManagedContainers() {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ["leetrade.managed=true"] },
    });
    for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);
      if (containerInfo.State === "running") {
        await container.stop({ t: 2 });
      }
      await container.remove({ force: true });
    }
    return containers.length;
  },
};
