import pexpect
import sys
import os

if 'CI' in os.environ: del os.environ['CI']
if 'GITHUB_ACTIONS' in os.environ: del os.environ['GITHUB_ACTIONS']

child = pexpect.spawn("npx prisma migrate dev --name rename_roles", encoding='utf-8')
child.logfile = sys.stdout
try:
    # We expect the warning about values being removed
    child.expect("this will fail.", timeout=15)
    child.expect(r"\? \(Y/n\)", timeout=5)
    child.sendline("y")
except pexpect.TIMEOUT:
    print("No prompt found or timed out")
child.expect(pexpect.EOF, timeout=120)
