-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('REGULAR', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'REGULAR',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelicula" (
    "id" TEXT NOT NULL,
    "swapiId" INTEGER,
    "titulo" TEXT NOT NULL,
    "fecha_estreno" TIMESTAMP(3),
    "episodio" INTEGER,
    "director" TEXT,
    "crawl_apertura" TEXT,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelicula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pelicula_swapiId_key" ON "Pelicula"("swapiId");
