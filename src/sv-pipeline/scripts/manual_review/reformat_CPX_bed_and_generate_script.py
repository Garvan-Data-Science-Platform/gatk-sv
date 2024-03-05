#!python
#this script takes in the CPX SVs in complex format, reformat them in svelter format meanwhile generate the script to collect PE metrics

def header_pos_readin(input_bed):
  fin=os.popen(r'''zcat %s'''%(input_bed))
  pin=fin.readline().strip().split()
  out = {}
  for i in range(len(pin)):
    out[pin[i]] = i
  fin.close()
  return out

def sample_pe_readin(sample_pe_file):
  #sample_pe_file is a 2 column file with sample ID and PE metrics on both columns
  out = {}
  fin=open(sample_pe_file)
  for line in fin:
    pin=line.strip().split()
    if not pin[0] in out.keys():
      out[pin[0]] = pin[1]
  fin.close()
  return out

def SVID_sample_readin(input_bed,header_pos):
  out={}
  fin=os.popen(r'''zcat %s'''%(input_bed))
  for line in fin:
    pin=line.strip().split('\t')
    if not pin[0][0]=='#':
      out[pin[header_pos['name']]] = pin[header_pos['samples']]
  fin.close()
  return out

def parse_segment(segment):
    svtype, interval = segment.split('_')
    chrom, coords = interval.split(':')
    coord1, coord2 = coords.split('-')
    return svtype, chrom, int(coord1), int(coord2)

# segments: CPX_INTERVALS split by ','
def extract_bp_list_for_inv_cnv_events(segments, cpx_type):
    s0_svtype, s0_chrom, s0_c1, s0_c2 = parse_segment(segments[0])
    breakpoints = [s0_chrom]+[s0_c1, s0_c2]
    if not 'INVdup' in cpx_type:
      for seg in segments[1:]:
        seg_svtype, seg_chrom, seg_c1, seg_c2 = parse_segment(seg)
        breakpoints.append(seg_c2)
    else:
      if cpx_type=='INVdup':
        s1_svtype, s1_chrom, s1_c1, s1_c2 = parse_segment(segments[0])
        if s1_c1[0] < breakpoints[2]:
          breakpoints = breakpoints[:2] + [s1_c1, breakpoints[2]]
      elif cpx_type == 'dupINVdup' or cpx_type == 'delINVdup':
        s2_svtype, s2_chrom, s2_c1, s2_c2 = parse_segment(segments[2])
        breakpoints += [s2_c1, s2_c2]
    return breakpoints

def extract_bp_list_for_ddup_events(coordinates, segments, small_sv_size_threshold):
    #example of coordinates: ["chr1",1154129,1154133]
    #example of segments: DUP_chr1:229987763-230011157
    del_bp = [coordinates[0], int(coordinates[1]), int(coordinates[2])]
    # CW: this looks like it only gets the coordinates from the first DUP segment?
    #dup_seg = [i for i in segments if 'DUP_' in i][0].split('_')[1].split(':')
    #dup_bp = [int(i) for i in dup_seg[1].split('-')]
    #INV_flag = len([i for i in segments if "INV_" in i])
    # rewrite as:
    INV_flag = 0
    for segment in segments:
        if 'DUP_' in segment:
            seg_svtype, seg_chrom, seg_c1, seg_c2 = parse_segment(segment)
            dup_bp = [seg_c1, seg_c2]
        if 'INV_' in segment:
            INV_flag = INV_flag + 1
    #INV_flag == 0 : no INV involved in the insertion
    #INV_flag > 0: INV involved

    if INV_flag==0:
      if del_bp[2] < dup_bp[0]:
          breakpints = del_bp + dup_bp
          if del_bp[2]-del_bp[1]>small_sv_size_threshold:
              structures = ['abc','cbc']
          else:
              structures = ['ab','bab']
      elif del_bp[1] > dup_bp[1]:
          breakpints   = [del_bp[0]]+dup_bp+del_bp[1:]
          if del_bp[2]-del_bp[1]>small_sv_size_threshold:
              structures = ['abc','aba']
          else:
              structures = ['ab','aba']
      elif del_bp[1] < dup_bp[0] and not del_bp[2] < dup_bp[0]:
          breakpints = del_bp[:2] + dup_bp
          structures = ['ab','bb']
      elif del_bp[1] < dup_bp[1] and not del_bp[2] < dup_bp[1]:
          breakpints = [del_bp[0]]+dup_bp+[del_bp[2]]
          structures = ['ab','aa']
    elif INV_flag>0:
      if del_bp[2] < dup_bp[0]:
          breakpints = del_bp + dup_bp
          if del_bp[2]-del_bp[1]>small_sv_size_threshold:
              structures = ['abc','c^bc']
          else:
              structures = ['ab','b^ab']
      elif del_bp[1] > dup_bp[1]:
          breakpints   = [del_bp[0]]+dup_bp+del_bp[1:]
          if del_bp[2]-del_bp[1]>small_sv_size_threshold:
              structures = ['abc','aba^']
          else:
              structures = ['ab','aba^']
      elif del_bp[1] < dup_bp[0] and not del_bp[2] < dup_bp[0]:
          breakpints = del_bp[:2] + dup_bp
          structures = ['ab','b^b']
      elif del_bp[1] < dup_bp[1] and not del_bp[2] < dup_bp[1]:
          breakpints = [del_bp[0]]+dup_bp+[del_bp[2]]
          structures = ['ab','aa^']
    return [breakpints, structures]

def extract_bp_list_for_ins_idel(coordinates, segments, small_sv_size_threshold):
    #example of coordinates: ["chr1",1154129,1154133]
    #example of segments: DUP_chr1:229987763-230011157
    del_bp = [coordinates[0], int(coordinates[1]), int(coordinates[2])]
    dup_seg = [i for i in segments if 'INS_' in i][0].split('_')[1].split(':')
    dup_bp = [int(i) for i in dup_seg[1].split('-')]
    INV_flag = len([i for i in segments if "INV_" in i])
    #INV_flag == 0 : no INV involved in the insertion
    #INV_flag > 0: INV involved
    if INV_flag==0:
      if del_bp[2] < dup_bp[0]:
          breakpints = del_bp + dup_bp
          if del_bp[2]-del_bp[1]> small_sv_size_threshold:
              structures = ['abc','cbc']
          else:
              structures = ['ab','bab']
      elif del_bp[1] > dup_bp[1]:
          breakpints   = [del_bp[0]]+dup_bp+del_bp[1:]
          if del_bp[2]-del_bp[1]> small_sv_size_threshold:
              structures = ['abc','aba']
          else:
              structures = ['ab','aba']
      elif del_bp[1] < dup_bp[0] and not del_bp[2] < dup_bp[0]:
          breakpints = del_bp[:2] + dup_bp
          structures = ['ab','bb']
      elif del_bp[1] < dup_bp[1] and not del_bp[2] < dup_bp[1]:
          breakpints = [del_bp[0]]+dup_bp+[del_bp[2]]
          structures = ['ab','aa']
    elif INV_flag>0:
      if del_bp[2] < dup_bp[0]:
          breakpints = del_bp + dup_bp
          if del_bp[2]-del_bp[1]> small_sv_size_threshold:
              structures = ['abc','c^bc']
          else:
              structures = ['ab','b^ab']
      elif del_bp[1] > dup_bp[1]:
          breakpints   = [del_bp[0]]+dup_bp+del_bp[1:]
          if del_bp[2]-del_bp[1]> small_sv_size_threshold:
              structures = ['abc','aba^']
          else:
              structures = ['ab','aba^']
      elif del_bp[1] < dup_bp[0] and not del_bp[2] < dup_bp[0]:
          breakpints = del_bp[:2] + dup_bp
          structures = ['ab','b^b']
      elif del_bp[1] < dup_bp[1] and not del_bp[2] < dup_bp[1]:
          breakpints = [del_bp[0]]+dup_bp+[del_bp[2]]
          structures = ['ab','aa^']
    return [breakpints, structures]

def extract_bp_list_V4(coordinates, segments, small_sv_size_threshold):
    del_bp = [coordinates[0], int(coordinates[1]), int(coordinates[2])]
    dup_seg = [i for i in segments if 'INV_' in i][0].split('_')[1].split(':')
    dup_bp = [int(i) for i in dup_seg[1].split('-')]
    INV_flag = 1
    if del_bp[2] < dup_bp[0]:
        breakpoints = del_bp + dup_bp
        if del_bp[2]-del_bp[1]> small_sv_size_threshold:
            structures = ['abc','c^bc']
        else:
            structures = ['ab','b^ab']
    elif del_bp[1] > dup_bp[1]:
        breakpoints = [del_bp[0]]+dup_bp+del_bp[1:]
        if del_bp[2]-del_bp[1]> small_sv_size_threshold:
            structures = ['abc','aba^']
        else:
            structures = ['ab','aba^']
    return [breakpoints, structures]

def is_interchromosomal(pin, header_pos):
   chrom = pin[0]
   if pin[header_pos['CPX_TYPE']] in ['dDUP', 'dDUP_iDEL']:
      seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'DUP_' in i][0].split('_')[1].split(':')
      if seg2[0] != chrom:
          return True
   elif pin[header_pos['CPX_TYPE']] in ['INS_iDEL']:
      seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'INS_' in i][0].split('_')[1].split(':')
      if seg2[0] != chrom:
         return True
   elif pin[header_pos['CPX_TYPE']] in ['CTX_PQ/QP', 'CTX_PP/QQ'] or pin[header_pos['SVTYPE']] in ['CTX']:
      return True
   elif "INV_" in pin[header_pos['SOURCE']] and pin[header_pos['SVTYPE']]=="INS":
      seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'INV_' in i][0].split('_')[1].split(':')
      seg2 = [seg2[0]]+seg2[1].split('-')
      if seg2[0] != chrom:
          return True
   return False

def cpx_SV_readin(input_bed, header_pos):
  fin=os.popen(r'''zcat %s'''%(input_bed))
  out = []
  small_sv_size_threshold = 250
  for line in fin:
    pin=line.strip().split('\t')
    if not pin[0][0]=="#":
      if not is_interchromosomal(pin, header_pos):
        if pin[header_pos['CPX_TYPE']] in ['delINV', 'INVdel', 'dupINV','INVdup','delINVdel', 'delINVdup','dupINVdel','dupINVdup']:
          segments = pin[header_pos['CPX_INTERVALS']].split(',')
          breakpoints = extract_bp_list_for_inv_cnv_events(segments, pin[header_pos['CPX_TYPE']])
          if pin[header_pos['CPX_TYPE']] == 'delINV':
            ref_alt = ['ab','b^']
          if pin[header_pos['CPX_TYPE']] == 'INVdel':
            ref_alt = ['ab','a^']
          if pin[header_pos['CPX_TYPE']] == 'dupINV':
            ref_alt = ['ab','aba^']
          if pin[header_pos['CPX_TYPE']] == 'INVdup':
            ref_alt = ['ab','b^ab']
          if pin[header_pos['CPX_TYPE']] == 'delINVdel':
            ref_alt = ['abc','b^']
          if pin[header_pos['CPX_TYPE']] == 'delINVdup':
            ref_alt = ['abc','c^bc']
          if pin[header_pos['CPX_TYPE']] == 'dupINVdel':
            ref_alt = ['abc','aba^']
          if pin[header_pos['CPX_TYPE']] == 'dupINVdup':
            ref_alt = ['abc','ac^b^a^c']
        elif pin[header_pos['CPX_TYPE']] in ['dDUP', 'dDUP_iDEL']:
          segments = pin[header_pos['CPX_INTERVALS']].split(',')
          cpx_info = extract_bp_list_for_ddup_events(pin[:3], segments, small_sv_size_threshold)
          ref_alt = cpx_info[1]
          breakpoints = cpx_info[0]
        elif pin[header_pos['CPX_TYPE']] in ['INS_iDEL']:
          segments = pin[header_pos['SOURCE']].split(',')
          cpx_info = extract_bp_list_for_ins_idel(pin[:3], segments, small_sv_size_threshold)
          ref_alt = cpx_info[1]
          breakpoints = cpx_info[0]
        else:
          segments = pin[header_pos['SOURCE']].split(',')
          cpx_info = extract_bp_list_V4(pin[:3], segments, small_sv_size_threshold)
          ref_alt = cpx_info[1]
          breakpoints = cpx_info[0]
        out.append([breakpoints, ref_alt,pin[3]])
    else:
      continue
  fin.close()
  return out

def cpx_inter_chromo_SV_readin(input_bed, header_pos):
  fin=os.popen(r'''zcat %s'''%(input_bed))
  out = []
  chr_list = ['chr'+str(i) for i in range(1,23)]+['chrX','chrY']
  for line in fin:
    pin=line.strip().split('\t')
    if not pin[0][0]=="#":
      if is_interchromosomal(pin, header_pos):
        if pin[header_pos['CPX_TYPE']] in ['dDUP', 'dDUP_iDEL']:          
          seg1 = pin[:3]
          seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'DUP_' in i][0].split('_')[1].split(':')
          seg2 = [seg2[0]]+seg2[1].split('-')  
          if chr_list.index(seg1[0]) < chr_list.index(seg2[0]):
            bp = [[seg1[0]]+[int(i) for i in seg1[1:]], [seg2[0]]+[int(i) for i in seg2[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['ab_c', 'cb_c']  
            else:
              ref_alt = ['a_b', 'ba_b']          
          elif chr_list.index(seg1[0]) > chr_list.index(seg2[0]):
            bp = [[seg2[0]]+[int(i) for i in seg2[1:]], [seg1[0]]+[int(i) for i in seg1[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['a_bc','a_ba']  
            else:
              ref_alt = ['a_b', 'a_ba']    
        elif pin[header_pos['CPX_TYPE']] in ['INS_iDEL']:   
          seg1 = pin[:3]
          seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'INS_' in i][0].split('_')[1].split(':')
          seg2 = [seg2[0]]+seg2[1].split('-')  
          if chr_list.index(seg1[0]) < chr_list.index(seg2[0]):
            bp = [[seg1[0]]+[int(i) for i in seg1[1:]], [seg2[0]]+[int(i) for i in seg2[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['ab_c', 'cb_c']  
            else:
              ref_alt = ['a_b', 'ba_b']          
          elif chr_list.index(seg1[0]) > chr_list.index(seg2[0]):
            bp = [[seg2[0]]+[int(i) for i in seg2[1:]], [seg1[0]]+[int(i) for i in seg1[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['a_bc','a_ba']  
            else:
              ref_alt = ['a_b', 'a_ba']    
        elif pin[header_pos['CPX_TYPE']] in ['CTX_PQ/QP', 'CTX_PP/QQ'] or pin[header_pos['SVTYPE']] in ['CTX']:
          seg1 = pin[:3]
          seg2 = [pin[header_pos['CHR2']], pin[header_pos['END2']], pin[header_pos['END2']]]
          if chr_list.index(seg1[0]) < chr_list.index(seg2[0]):
            bp = [[seg1[0]]+[int(i) for i in seg1[1:]], [seg2[0]]+[int(i) for i in seg2[1:]]]
          elif chr_list.index(seg1[0]) > chr_list.index(seg2[0]):
            bp = [[seg2[0]]+[int(i) for i in seg2[1:]], [seg1[0]]+[int(i) for i in seg1[1:]]]
          ref_alt = [pin[header_pos['CPX_TYPE']]]
        elif "INV_" in pin[header_pos['SOURCE']] and pin[header_pos['SVTYPE']]=="INS":
          seg1 = pin[:3]
          seg2 = [i for i in pin[header_pos['SOURCE']].split(',') if 'INV_' in i][0].split('_')[1].split(':')
          seg2 = [seg2[0]]+seg2[1].split('-')  
          if chr_list.index(seg1[0]) < chr_list.index(seg2[0]):
            bp = [[seg1[0]]+[int(i) for i in seg1[1:]], [seg2[0]]+[int(i) for i in seg2[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['ab_c', 'c^b_c']  
            else:
              ref_alt = ['a_b', 'b^a_b']          
          elif chr_list.index(seg1[0]) > chr_list.index(seg2[0]):
            bp = [[seg2[0]]+[int(i) for i in seg2[1:]], [seg1[0]]+[int(i) for i in seg1[1:]]]
            if int(seg1[2])-int(seg1[1])>250:
              ref_alt = ['a_bc','a_ba^']  
            else:
              ref_alt = ['a_b', 'a_ba^']    
        out.append([bp, ref_alt, pin[3]])
  fin.close()
  return out

def cpx_sample_batch_readin(cpx_SV, SVID_sample,sample_pe, PE_evidence, out_file):  
  out = []
  flank_back = 1000
  flank_front = 100
  fo=open(out_file,'w')
  for info in cpx_SV:
    print(info)
    breakpints = info[0]
    if info[1][0] == 'ab' and info[1][1]=='b^': #delINV
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_front)+'-'+str(breakpints[2]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='b^': #delINVdel
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_front)+'-'+str(breakpints[2]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[4]-flank_front) , '&&', '$5<'+str(breakpints[4]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='c^bc': #delINVdup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[4]-flank_back) , '&&', '$5<'+str(breakpints[4]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_front)+'-'+str(breakpints[2]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='aba^': #dupINV
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='ac^b^a^c': #dupINVdup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[4]-flank_back) , '&&', '$5<'+str(breakpints[4]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='aba^': #dupINVdel
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[4]-flank_front) , '&&', '$5<'+str(breakpints[4]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='a^': #INVdel
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[2]-flank_back) , '&&', '$5<'+str(breakpints[2]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='b^ab': #INVdup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="-"', '&&', '$5>'+str(breakpints[2]-flank_front) , '&&', '$5<'+str(breakpints[2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='aba': #dupINS
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='aba': #dupINSdel
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[4]-flank_front) , '&&', '$5<'+str(breakpints[4]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='aa': #dupdel
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_back)+'-'+str(breakpints[2]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[2]-flank_back) , '&&', '$5<'+str(breakpints[2]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='bab': #INSdup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[2]-flank_front) , '&&', '$5<'+str(breakpints[2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_front)+'-'+str(breakpints[1]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'abc' and info[1][1]=='cbc': #delINSdup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[3]-flank_front) , '&&', '$5<'+str(breakpints[3]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_front)+'-'+str(breakpints[2]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[4]-flank_back) , '&&', '$5<'+str(breakpints[4]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1][0] == 'ab' and info[1][1]=='bb': #deldup
      common_1 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[1]-flank_back)+'-'+str(breakpints[1]+flank_front), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="+" && $6=="-"', '&&', '$5>'+str(breakpints[2]-flank_front) , '&&', '$5<'+str(breakpints[2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0]+':'+str(breakpints[2]-flank_front)+'-'+str(breakpints[2]+flank_back), '| grep', 'sample', '| awk', "'{if ($1==$4", '&&', '$3=="-" && $6=="+"', '&&', '$5>'+str(breakpints[3]-flank_back) , '&&', '$5<'+str(breakpints[3]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['a_b','ba_b'] or info[1] == ['ab_c','cb_c']:   #ddup or ddup_iDEL, insertion from the smaller chromosome to the larger chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_back)+'-'+str(breakpints[0][1]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_front) , '&&', '$5<'+str(breakpints[1][1]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_front)+'-'+str(breakpints[0][2]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_back) , '&&', '$5<'+str(breakpints[1][2]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['a_b','a_ba'] or info[1] == ['a_bc','a_ba']:   #ddup or ddup_iDEL, insertion from the larger chromosome to the smaller chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_front)+'-'+str(breakpints[0][1]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_back) , '&&', '$5<'+str(breakpints[1][1]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_back)+'-'+str(breakpints[0][2]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_front) , '&&', '$5<'+str(breakpints[1][2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['a_b', 'b^a_b'] or info[1] == ['ab_c', 'c^b_c']: #inverted insertion, insertion from the smaller chromosome to the larger chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_back)+'-'+str(breakpints[0][1]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_back) , '&&', '$5<'+str(breakpints[1][2]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_front)+'-'+str(breakpints[0][2]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_front) , '&&', '$5<'+str(breakpints[1][1]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['a_b', 'a_ba^'] or info[1] == ['a_bc','a_ba^']:  #inverted insertion, insertion from the larger chromosome to the smaller chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_front)+'-'+str(breakpints[0][1]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_front) , '&&', '$5<'+str(breakpints[1][2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_back)+'-'+str(breakpints[0][2]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_back) , '&&', '$5<'+str(breakpints[1][1]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['CTX_PQ/QP']:  #inverted insertion, insertion from the larger chromosome to the smaller chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_back)+'-'+str(breakpints[0][1]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_back) , '&&', '$5<'+str(breakpints[1][1]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_front)+'-'+str(breakpints[0][2]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_front) , '&&', '$5<'+str(breakpints[1][2]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    elif info[1] == ['CTX_PP/QQ']:  #inverted insertion, insertion from the larger chromosome to the smaller chromosome
      common_1 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][1]-flank_back)+'-'+str(breakpints[0][1]+flank_front), '| grep', 'sample', '| awk', "'{if (", '$3=="+" && $6=="-"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][1]-flank_front) , '&&', '$5<'+str(breakpints[1][1]+flank_back), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
      common_2 = ['tabix', 'PE_metrics', breakpints[0][0]+':'+str(breakpints[0][2]-flank_front)+'-'+str(breakpints[0][2]+flank_back), '| grep', 'sample', '| awk', "'{if (", '$3=="-" && $6=="+"', '&&', '$4=="' + breakpints[1][0] +'" &&', '$5>'+str(breakpints[1][2]-flank_back) , '&&', '$5<'+str(breakpints[1][2]+flank_front), ") print}' | sed -e 's/$/\\t", info[2],"/'", '>>', PE_evidence]
    else:
      print(info)
    samples = SVID_sample[info[2]]
    if not samples =='' and not samples=='NA': 
      sample_list = samples.split(',')
      print(len(sample_list))
      pe_metrics_list = [sample_pe[samp] for samp in sample_list]
      for num in range(len(sample_list)):
        common_1[1] = pe_metrics_list[num]
        common_2[1] = pe_metrics_list[num]
        common_1[4] = sample_list[num]
        common_2[4] = sample_list[num]
        write_1 = ' '.join(common_1)
        write_2 = ' '.join(common_2)
        #if not write_1 in out and not write_2 in out:
        print(write_1, file=fo)
        print(write_2, file=fo)
	#out.append(write_1)
        #out.append(write_2)
  fo.close()
  return out

def write_cpx_command(cpx_command, out_file):
  fo=open(out_file,'w')
  for i in cpx_command:
    print(i, file=fo)
  fo.close()

def write_cpx_SVs(cpx_SV, out_file):
  fo=open(out_file,'w')
  for i in cpx_SV:
    out = [i[2],':'.join([str(j) for j in i[0]])]+i[1]
    print('\t'.join(out), file=fo)
  fo.close()

def main():
  """
  Command-line main block
  """

  # Parse command line arguments and options
  parser = argparse.ArgumentParser(
          description=__doc__,
          formatter_class=argparse.RawDescriptionHelpFormatter)
  parser.add_argument('-i','--input', required=True, help='input file of CPX events in bed format')
  parser.add_argument('-s','--sample_pe', required=True, help='2 column file with sample ID and PE metrics information')
  parser.add_argument('-p','--pe_evidence', required=True, help='name of file to store collected PE metrics')
  parser.add_argument('-c','--command_script', required=True, help='name of file that has scripts to collect PE evidences')
  parser.add_argument('-r','--reformat_SV', required=True, help='reformatted SV in svelter format')
  args = parser.parse_args()

  input_bed = args.input
  sample_pe_file = args.sample_pe
  PE_evidence = args.pe_evidence
  command_script = args.command_script
  reformatted_SV = args.reformat_SV

  header_pos = header_pos_readin(input_bed)
  sample_pe = sample_pe_readin(sample_pe_file)
  SVID_sample = SVID_sample_readin(input_bed, header_pos)

  cpx_SV = cpx_SV_readin(input_bed, header_pos)
  cpx_inter_chromo_SV = cpx_inter_chromo_SV_readin(input_bed, header_pos)
  write_cpx_SVs(cpx_SV+cpx_inter_chromo_SV, reformatted_SV)

  cpx_command = cpx_sample_batch_readin(cpx_SV+cpx_inter_chromo_SV, SVID_sample, sample_pe, PE_evidence, command_script)
  #write_cpx_command(cpx_command,command_script)

import os
import sys
import argparse
if __name__ == '__main__':
        main()

