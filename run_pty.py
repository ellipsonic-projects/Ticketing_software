import pty
import os
import sys
pty.spawn(["npx", "prisma", "migrate", "dev", "--name", "rename_roles"])
