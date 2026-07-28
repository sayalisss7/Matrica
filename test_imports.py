import sys
import traceback
try:
    import backend.main
    print('SUCCESS')
except Exception as e:
    traceback.print_exc()
