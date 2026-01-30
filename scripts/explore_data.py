#!/usr/bin/env python3
"""
Explore the OMT data files - proposal and application data structure.
"""

import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

def extract_docx_text(filepath: str) -> str:
    """Extract plain text from a .docx file using zipfile + XML parsing."""
    text_parts = []
    with zipfile.ZipFile(filepath, 'r') as z:
        if 'word/document.xml' in z.namelist():
            with z.open('word/document.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                    para_text = []
                    for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
                        for text_elem in run.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                            if text_elem.text:
                                para_text.append(text_elem.text)
                    if para_text:
                        text_parts.append(''.join(para_text))
    return '\n'.join(text_parts)


def main():
    # Read the Phase 1 proposal
    proposal_path = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Proposal/OMT - Application Review System - Phase 1.docx")

    print("=" * 80)
    print("PHASE 1 PROPOSAL")
    print("=" * 80)
    print(extract_docx_text(str(proposal_path)))
    print()

    # Also read the in-person meeting notes
    meeting_path = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Proposal/In person meet - 31_10_2025.docx")
    print("=" * 80)
    print("IN-PERSON MEETING NOTES")
    print("=" * 80)
    print(extract_docx_text(str(meeting_path)))


if __name__ == "__main__":
    main()
