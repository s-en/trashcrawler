import sys
import camelot
import matplotlib.pyplot as plt
import ast

args = sys.argv

option = {'copy_text':['v'], 'line_scale':40, 'split_text':True}
if len(args[3]) > 0:
  optionPlus = ast.literal_eval(args[3])
  option.update(optionPlus)

tables = camelot.read_pdf('rawpdf\\'+args[1]+'\\'+args[2]+'.pdf', **option)

tables.export('rawdata\\'+args[1]+'\\'+args[2]+'.html', f='html')

#camelot.plot(tables[1], kind='grid')
#plt.show()