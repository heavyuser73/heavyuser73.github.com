# -*- coding: utf-8 -*-
import sys, getopt

def main(argv):
    inputfile = ''
    outputfile = ''
   
    try:
        opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
    except getopt.GetoptError:
        print 'test.py -i <inputfile> -o <outputfile>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'test.py -i <inputfile> -o <outputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfile = arg
        elif opt in ("-o", "--ofile"):
            outputfile = arg

    fout = open(outputfile,'w')

    fout.write("[" + "\n")

    with open(inputfile, 'r') as ins :
        print "start"
        for line in ins:
            line = line.strip()
            if len(line) > 0 and line.count('–') > 1:
                splited_line = line.split('–')
                splited_line = splited_line[1].split('(')
                splited_string = splited_line[0].strip()
                if len(splited_string) > 0 : 
                    fout.write("\"" + splited_string + "\"," + "\n")
                    print splited_string
        print "end"
    fout.write("]" + "\n")
    fout.close()





if __name__== "__main__" :
    main(sys.argv[1:])
