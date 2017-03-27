import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {SegmentService} from './segment.service';
import {Segment} from './segment';
import {MetadataService} from '../metadata/metadata.service';
import {MetaType} from "../metadata/metatype";

@Component({
    templateUrl: 'static/app/templates/operation/segment.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        SegmentService,
        MetadataService
    ]
})
export class SegmentComponent {
    segment = new Segment();

    segments: Segment[];
    error: any;
    userTypes: MetaType[];

    constructor(private segmentService: SegmentService,
                private metadataService: MetadataService,
                private router: Router) {
    }

    ngOnInit() {
        this.segmentService
            .listSegment()
            .then(segments => this.segments = segments)
            .catch(error => this.error = error);

        let code = '1001';
        this.metadataService
            .listMetaType(code)
            .then(usertypes => this.userTypes = usertypes)
            .catch(error => this.error = error);
    }

    addSegment() {
        this.segmentService
            .addSegment(this.segment)
            .then(segment => {
                console.log('new segment :' + JSON.stringify(segment));
                this.segments.push(segment);
                this.segment = new Segment()
            })
            .catch(error => this.error = error); // TODO: Display error message
    }

    delItem(segment: Segment) {
        this.segmentService
            .delSegment(segment.id)
            .then(res => this.segments = res.ok ? this.segments.filter(item => item.id != segment.id) : this.segments)
            .catch(error => this.error = error);
    }
}